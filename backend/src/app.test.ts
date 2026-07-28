import request from 'supertest';
import { createApp } from './app';

describe('SafeVault API', () => {
  // Teste simples para confirmar que a aplicação inicia e responde no endpoint de saúde.
  it('returns an OK health response', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
