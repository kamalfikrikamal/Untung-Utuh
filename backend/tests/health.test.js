const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Health Check', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('GET /api/health returns 200 and ok status when DB is connected', async () => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => 1,
      configurable: true,
    });

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services.database.status).toBe('connected');
    expect(res.body.services.database.healthy).toBe(true);

    delete mongoose.connection.readyState;
  });

  it('GET /api/health returns 200 or 503 with health info', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('services');
    expect(res.body.services).toHaveProperty('database');
    expect(res.body.services).toHaveProperty('memory');
  });

  it('GET /api/health has environment field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('environment', 'test');
  });

  it('GET /api/health defaults environment to development when NODE_ENV is unset', async () => {
    const original = process.env.NODE_ENV;
    delete process.env.NODE_ENV;

    const res = await request(app).get('/api/health');
    expect(res.body.environment).toBe('development');

    process.env.NODE_ENV = original;
  });

  it('GET /api/health returns 503 and degraded status when DB is disconnected', async () => {
    // readyState is not configurable via jest.spyOn — use Object.defineProperty
    const proto = Object.getPrototypeOf(mongoose.connection);
    const original = Object.getOwnPropertyDescriptor(proto, 'readyState');
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => 0,
      configurable: true,
    });

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.services.database.status).toBe('disconnected');
    expect(res.body.services.database.healthy).toBe(false);

    // Restore original descriptor
    if (original) {
      Object.defineProperty(mongoose.connection, 'readyState', original);
    } else {
      delete mongoose.connection.readyState;
    }
  });

  it('GET /api/health returns unknown db status for unrecognised readyState', async () => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      get: () => 99,
      configurable: true,
    });

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(503);
    expect(res.body.services.database.status).toBe('unknown');

    delete mongoose.connection.readyState;
  });

  it('GET /api/health version falls back to 1.0.0 when npm_package_version is unset', async () => {
    const original = process.env.npm_package_version;
    delete process.env.npm_package_version;

    const res = await request(app).get('/api/health');
    expect(res.body.version).toBe('1.0.0');

    if (original !== undefined) process.env.npm_package_version = original;
  });

  it('GET /api/nonexistent returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });
});
