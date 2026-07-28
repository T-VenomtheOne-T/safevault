import argon2 from 'argon2';
import { AuditEventType, PrismaClient } from '@prisma/client';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../config/env';
import { requireAuth, type AuthenticatedRequest } from '../middleware/require-auth';
import { createAccessToken, createRefreshToken, hashRefreshToken } from '../security/tokens';

// Regras para criar uma conta: normaliza o e-mail e exige uma palavra-passe forte.
const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
  displayName: z.string().trim().min(1).max(100).optional()
});
// No início de sessão não é necessário receber o nome de apresentação.
const loginSchema = credentialsSchema.pick({ email: true, password: true });
// Para mudar a palavra-passe é necessário confirmar primeiro a palavra-passe atual.
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(12).max(128)
});
// Nome do cookie que contém o token usado para renovar a sessão.
const refreshCookieName = 'safevault_refresh';

// Recolhe contexto técnico útil para auditoria, sem guardar dados sensíveis.
const auditContext = (request: Parameters<Router['post']>[1] extends (req: infer R, ...args: never[]) => unknown ? R : never) => ({
  ipAddress: request.ip,
  userAgent: request.get('user-agent')?.slice(0, 512)
});

export const authRouter = (prisma: PrismaClient) => {
  const router = Router();
  // As rotas de entrada são mais limitadas para abrandar ataques de força bruta.
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
  // O browser não consegue ler este cookie; em produção só é enviado por HTTPS.
  const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/api/auth', maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86_400_000 };
  // Cria uma sessão: guarda apenas o hash do token e devolve um JWT de curta duração.
  const sendSession = async (user: { id: string; email: string; displayName: string | null }, response: import('express').Response) => {
    const refreshToken = createRefreshToken();
    await prisma.refreshToken.create({ data: { tokenHash: hashRefreshToken(refreshToken), expiresAt: new Date(Date.now() + cookieOptions.maxAge), userId: user.id } });
    response.cookie(refreshCookieName, refreshToken, cookieOptions).status(200).json({ accessToken: createAccessToken({ sub: user.id, email: user.email }), user: { id: user.id, email: user.email, displayName: user.displayName } });
  };

  router.post('/register', authLimiter, async (request, response, next) => {
    try {
      // Valida os dados antes de tocar na base de dados.
      const input = credentialsSchema.parse(request.body);
      // Argon2id transforma a palavra-passe num hash difícil de quebrar.
      const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 });
      const user = await prisma.user.create({ data: { email: input.email, passwordHash, displayName: input.displayName } });
      await prisma.auditLog.create({ data: { userId: user.id, eventType: AuditEventType.ACCOUNT_REGISTERED, ...auditContext(request) } });
      await sendSession(user, response);
    } catch (error: unknown) {
      // Devolve erros compreensíveis para campos inválidos ou e-mail já existente.
      if (error instanceof z.ZodError) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Provide a valid email and a password of at least 12 characters.' } });
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') return response.status(409).json({ error: { code: 'EMAIL_IN_USE', message: 'An account with that email already exists.' } });
      return next(error);
    }
  });

  router.post('/login', authLimiter, async (request, response, next) => {
    try {
      const input = loginSchema.parse(request.body);
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      // Compara a palavra-passe recebida com o hash, sem nunca a guardar.
      const valid = user ? await argon2.verify(user.passwordHash, input.password) : false;
      if (!user || !valid) {
        if (user) await prisma.auditLog.create({ data: { userId: user.id, eventType: AuditEventType.LOGIN_FAILED, ...auditContext(request) } });
        return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } });
      }
      await prisma.auditLog.create({ data: { userId: user.id, eventType: AuditEventType.LOGIN_SUCCEEDED, ...auditContext(request) } });
      return sendSession(user, response);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Provide a valid email and password.' } });
      return next(error);
    }
  });

  router.post('/refresh', async (request, response, next) => {
    try {
      // Obtém o token persistente do cookie, que o JavaScript do browser não lê.
      const token = request.cookies[refreshCookieName] as string | undefined;
      if (!token) return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'A refresh token is required.' } });
      // Procura pelo hash e confirma que a sessão continua ativa e dentro da validade.
      const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(token) }, include: { user: true } });
      if (!record || record.revokedAt || record.expiresAt <= new Date()) {
        response.clearCookie(refreshCookieName, cookieOptions);
        return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'The refresh token is invalid or expired.' } });
      }
      // Rotação: invalida o token usado antes de emitir um novo.
      await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
      return sendSession(record.user, response);
    } catch (error) { return next(error); }
  });

  router.post('/logout', async (request, response, next) => {
    try {
      const token = request.cookies[refreshCookieName] as string | undefined;
      if (token) {
        const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hashRefreshToken(token) } });
        // Mesmo que não exista sessão válida, a resposta limpa sempre o cookie local.
        if (record && !record.revokedAt) {
          await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
          await prisma.auditLog.create({ data: { userId: record.userId, eventType: AuditEventType.LOGOUT, ...auditContext(request) } });
        }
      }
      return response.clearCookie(refreshCookieName, cookieOptions).status(204).send();
    } catch (error) { return next(error); }
  });

  router.get('/me', requireAuth, async (request, response, next) => {
    try {
      // A identidade vem do JWT já validado pelo middleware requireAuth.
      const user = await prisma.user.findUnique({ where: { id: (request as AuthenticatedRequest).auth.sub }, select: { id: true, email: true, displayName: true, createdAt: true } });
      if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'The account no longer exists.' } });
      return response.status(200).json({ user });
    } catch (error) { return next(error); }
  });

  router.post('/change-password', requireAuth, async (request, response, next) => {
    try {
      const input = passwordChangeSchema.parse(request.body);
      const auth = (request as AuthenticatedRequest).auth;
      const user = await prisma.user.findUnique({ where: { id: auth.sub } });
      // Evita que alguém com um token roubado altere a palavra-passe sem a conhecer.
      if (!user || !(await argon2.verify(user.passwordHash, input.currentPassword))) {
        return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'The current password is incorrect.' } });
      }
      const passwordHash = await argon2.hash(input.newPassword, { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 });
      // Atualiza a palavra-passe, termina sessões e cria a auditoria como uma única operação.
      await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
        prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }),
        prisma.auditLog.create({ data: { userId: user.id, eventType: AuditEventType.PASSWORD_CHANGED, ...auditContext(request) } })
      ]);
      return response.clearCookie(refreshCookieName, cookieOptions).status(204).send();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) return response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'The new password must be at least 12 characters.' } });
      return next(error);
    }
  });
  return router;
};
