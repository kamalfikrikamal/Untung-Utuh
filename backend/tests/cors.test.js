const express = require('express');
const request = require('supertest');

const ORIGINAL_CORS_ORIGIN = process.env.CORS_ORIGIN;

// Pre-load cors with CORS_ORIGIN set to cover the truthy branch of || on line 4
process.env.CORS_ORIGIN = 'http://preload-coverage.test';
require('../src/middleware/cors');
delete process.env.CORS_ORIGIN;
jest.resetModules();

function makeApp(corsMiddleware) {
  const app = express();
  app.use(corsMiddleware);
  app.get('/test', (_req, res) => res.json({ ok: true }));
  // Error handler so CORS errors produce a JSON 500 response
  app.use((err, _req, res, _next) => {
    res.status(500).json({ error: err.message });
  });
  return app;
}

describe('cors middleware', () => {
  afterEach(() => {
    jest.resetModules();
    if (ORIGINAL_CORS_ORIGIN === undefined) {
      delete process.env.CORS_ORIGIN;
    } else {
      process.env.CORS_ORIGIN = ORIGINAL_CORS_ORIGIN;
    }
  });

  it('allows requests with no origin (server-to-server / curl)', async () => {
    const corsMiddleware = require('../src/middleware/cors');
    const app = makeApp(corsMiddleware);
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('allows requests from the default allowed origin', async () => {
    const corsMiddleware = require('../src/middleware/cors');
    const app = makeApp(corsMiddleware);
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:5173');
    expect(res.statusCode).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('blocks requests from a disallowed origin with CORS error', async () => {
    const corsMiddleware = require('../src/middleware/cors');
    const app = makeApp(corsMiddleware);
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://evil.com');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/CORS policy/);
  });

  it('allows multiple origins configured via CORS_ORIGIN env variable', async () => {
    process.env.CORS_ORIGIN = 'http://app1.example.com,  http://app2.example.com';
    jest.resetModules();
    const corsMiddleware = require('../src/middleware/cors');
    const app = makeApp(corsMiddleware);

    const res1 = await request(app)
      .get('/test')
      .set('Origin', 'http://app1.example.com');
    expect(res1.statusCode).toBe(200);

    const res2 = await request(app)
      .get('/test')
      .set('Origin', 'http://app2.example.com');
    expect(res2.statusCode).toBe(200);
  });

  it('blocks an origin not in the multi-origin CORS_ORIGIN list', async () => {
    process.env.CORS_ORIGIN = 'http://app1.example.com,http://app2.example.com';
    jest.resetModules();
    const corsMiddleware = require('../src/middleware/cors');
    const app = makeApp(corsMiddleware);
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://attacker.com');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/CORS policy/);
  });
});
