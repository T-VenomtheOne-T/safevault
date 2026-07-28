import { createApp } from './app';
import { env } from './config/env';

// Cria a aplicação HTTP e começa a aceitar pedidos na porta configurada.
const app = createApp();
const server = app.listen(env.PORT, () => console.log(`SafeVault API listening on port ${env.PORT}`));

// Fecha o servidor de forma controlada quando o processo recebe um sinal de paragem.
const shutdown = (signal: string) => {
  console.log(`${signal} received; shutting down.`);
  server.close((error) => process.exit(error ? 1 : 0));
};

// SIGTERM é comum em Docker; SIGINT é enviado normalmente por Ctrl+C.
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
