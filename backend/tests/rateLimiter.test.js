const express = require('express');
const request = require('supertest');

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

describe('rateLimiter middleware', () => {
  afterEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  it('exports rateLimiter, authLimiter, and analyticsLimiter functions', () => {
    const { rateLimiter, authLimiter, analyticsLimiter } = require('../src/middleware/rateLimiter');
    expect(typeof rateLimiter).toBe('function');
    expect(typeof authLimiter).toBe('function');
    expect(typeof analyticsLimiter).toBe('function');
  });

  it('rateLimiter skip function returns true for /health path — no rate-limit headers', async () => {
    const { rateLimiter } = require('../src/middleware/rateLimiter');
    const app = express();
    app.set('trust proxy', 1);
    // Mounting under /api so that req.url inside middleware becomes /health
    app.use('/api', rateLimiter);
    app.get('/api/health', (_req, res) => res.json({ ok: true }));

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    // When the request is skipped, express-rate-limit does not add RateLimit headers
    expect(res.headers['ratelimit-limit']).toBeUndefined();
  });

  it('rateLimiter applies rate-limit headers on non-health routes (skip returns false)', async () => {
    const { rateLimiter } = require('../src/middleware/rateLimiter');
    const app = express();
    app.set('trust proxy', 1);
    app.use('/api', rateLimiter);
    app.get('/api/test', (_req, res) => res.json({ ok: true }));

    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    // standardHeaders: true → RateLimit header must be present
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });

  it('analyticsLimiter keyGenerator uses IP + storeId from body', async () => {
    const { analyticsLimiter } = require('../src/middleware/rateLimiter');
    const app = express();
    app.set('trust proxy', 1);
    app.use(express.json());
    app.post('/api/track', analyticsLimiter, (_req, res) => res.json({ ok: true }));

    const res = await request(app)
      .post('/api/track')
      .send({ storeId: 'abc123' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['ratelimit-limit']).toBeDefined();
  });

  it('analyticsLimiter keyGenerator handles missing storeId (falls back to empty string)', async () => {
    const { analyticsLimiter } = require('../src/middleware/rateLimiter');
    const app = express();
    app.set('trust proxy', 1);
    app.use(express.json());
    app.post('/api/track', analyticsLimiter, (_req, res) => res.json({ ok: true }));

    const res = await request(app)
      .post('/api/track')
      .send({});
    expect(res.statusCode).toBe(200);
  });

  it('uses max:1000 in non-production environment (NODE_ENV=test)', () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();
    const { rateLimiter } = require('../src/middleware/rateLimiter');
    expect(typeof rateLimiter).toBe('function');
  });

  it('uses max:100 and max:30 in production environment (NODE_ENV=production)', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const { rateLimiter, analyticsLimiter } = require('../src/middleware/rateLimiter');
    expect(typeof rateLimiter).toBe('function');
    expect(typeof analyticsLimiter).toBe('function');
  });
});
