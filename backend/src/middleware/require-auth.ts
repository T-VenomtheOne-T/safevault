import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, type AccessTokenPayload } from '../security/tokens';

// Tipo usado depois de confirmarmos que o pedido contém um JWT válido.
export type AuthenticatedRequest = Request & { auth: AccessTokenPayload };

// Protege rotas que exigem o cabeçalho: Authorization: Bearer <token>.
export const requireAuth = (request: Request, response: Response, next: NextFunction) => {
  const [scheme, token] = request.header('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' } });
  }
  try {
    // Guarda a identidade validada para a rota seguinte a poder usar.
    (request as AuthenticatedRequest).auth = verifyAccessToken(token);
    return next();
  } catch {
    return response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'The access token is invalid or expired.' } });
  }
};
