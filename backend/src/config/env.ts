import 'dotenv/config';
import { z } from 'zod';

// Define e valida todas as variáveis de ambiente usadas pela aplicação.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGIN: z.string().default(''),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32).default('development-only-secret-change-before-production'),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().min(1).max(60).default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30)
});

// Falha logo ao arrancar caso a configuração tenha um formato inválido.
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// Configuração validada, reutilizada pelos restantes ficheiros.
export const env = parsed.data;
// Transforma a lista de origens CORS numa lista limpa.
export const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);

// Em produção é obrigatório substituir o segredo de desenvolvimento.
if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'development-only-secret-change-before-production') {
  console.error('JWT_SECRET must be set to a unique value in production.');
  process.exit(1);
}
