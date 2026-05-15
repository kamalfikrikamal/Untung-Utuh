const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Health Check', () => {
  afterAll(async () => {
    await mongoose.disconnect();
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

  it('GET /api/nonexistent returns 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });
});
