import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { corsOrigins, env } from './config/env';
import { prisma } from './database/prisma';
import { authRouter } from './routes/auth';

// O registo de pedidos nunca deve guardar credenciais ou cookies.
const logger = pino({ level: env.LOG_LEVEL, redact: ['req.headers.authorization', 'req.headers.cookie'] });

export const createApp = () => {
  const app = express();
  // Remove uma assinatura desnecessária do Express nos cabeçalhos HTTP.
  app.disable('x-powered-by');
  // Aceita o IP original quando a aplicação está atrás de um proxy seguro.
  app.set('trust proxy', 1);
  app.use(pinoHttp({ logger }));
  app.use(helmet());
  // Só autoriza os sites definidos na configuração e permite o cookie de sessão.
  app.use(cors({ origin: corsOrigins.length ? corsOrigins : false, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));
  // Limite geral para reduzir abusos e tentativas automáticas contra a API.
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));

  app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
  // Todas as rotas de autenticação começam por /api/auth.
  app.use('/api/auth', authRouter(prisma));

  // Resposta consistente para rotas que não existem.
  app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
  // Última barreira: não expõe pormenores internos ao cliente.
  app.use((error: unknown, request: Request, response: Response, _next: NextFunction) => {
    void _next;
    request.log.error(error, 'Unhandled request error');
    response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } });
  });
  return app;
};
