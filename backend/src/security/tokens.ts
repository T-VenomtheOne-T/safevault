import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// Dados mínimos guardados dentro de um token de acesso.
export type AccessTokenPayload = { sub: string; email: string };

// Cria um JWT de curta duração para autenticar pedidos à API.
export const createAccessToken = (user: AccessTokenPayload) =>
  jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.sub,
    expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`,
    algorithm: 'HS256'
  });

// Confirma assinatura, algoritmo e estrutura do JWT recebido.
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  if (typeof decoded === 'string' || !decoded.sub || typeof decoded.email !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid access token payload');
  }
  return { sub: decoded.sub, email: decoded.email };
};

// Token aleatório longo, enviado apenas no cookie HttpOnly.
export const createRefreshToken = () => randomBytes(48).toString('base64url');
// Na base de dados fica apenas este resumo irreversível do refresh token.
export const hashRefreshToken = (token: string) => createHash('sha256').update(token).digest('hex');
