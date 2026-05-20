const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Analytics = require('../src/models/Analytics');

let mongod;
let token;
let storeId;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  const regRes = await request(app).post('/api/auth/register').send({
    name: 'Analytics Owner',
    email: 'analytics@example.com',
    password: 'Password123!',
  });
  token = regRes.body.token;

  const storeRes = await request(app)
    .post('/api/stores')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Analytics Store' });
  storeId = storeRes.body.data.store._id;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Analytics Routes', () => {
  describe('POST /api/analytics/track', () => {
    it('returns 202 for a valid view event', async () => {
      const res = await request(app)
        .post('/api/analytics/track')
        .send({ storeId, eventType: 'view' });

      expect(res.statusCode).toBe(202);
      expect(res.body.status).toBe('success');
    });

    it('creates an Analytics document after setImmediate resolves', async () => {
      await request(app)
        .post('/api/analytics/track')
        .send({ storeId, eventType: 'click' });

      // Wait for the deferred DB write
      await new Promise((resolve) => setImmediate(resolve));

      const count = await Analytics.countDocuments({ storeId });
      expect(count).toBe(1);
    });

    it('returns 404 when store does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post('/api/analytics/track')
        .send({ storeId: fakeId, eventType: 'view' });

      expect(res.statusCode).toBe(404);
    });

    it('returns 422 when eventType is missing', async () => {
      const res = await request(app)
        .post('/api/analytics/track')
        .send({ storeId });

      expect(res.statusCode).toBe(422);
    });

    it('returns 422 when storeId is not a valid ObjectId', async () => {
      const res = await request(app)
        .post('/api/analytics/track')
        .send({ storeId: 'not-an-id', eventType: 'view' });

      expect(res.statusCode).toBe(422);
    });

    it('logs error silently when Analytics.create fails inside setImmediate', async () => {
      const spy = jest
        .spyOn(Analytics, 'create')
        .mockRejectedValueOnce(new Error('DB write failed'));

      // The route responds 202 immediately (fire-and-forget); the DB error happens later
      const res = await request(app)
        .post('/api/analytics/track')
        .send({ storeId, eventType: 'wa_order' });

      // Wait for the deferred setImmediate callback to execute (and fail)
      await new Promise((resolve) => setImmediate(resolve));

      expect(res.statusCode).toBe(202);
      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });
  });

  describe('GET /api/analytics/summary', () => {
    it('returns 401 without an auth token', async () => {
      const res = await request(app).get(`/api/analytics/summary?storeId=${storeId}`);
      expect(res.statusCode).toBe(401);
    });

    it('returns 422 when storeId query param is missing', async () => {
      const res = await request(app)
        .get('/api/analytics/summary')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(422);
    });

    it('returns 403 for a store not owned by the requesting user', async () => {
      const otherId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/analytics/summary?storeId=${otherId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
    });

    it('returns 200 with totals and series for owned store', async () => {
      const res = await request(app)
        .get(`/api/analytics/summary?storeId=${storeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('totals');
      expect(res.body.data).toHaveProperty('series');
      expect(res.body.data.totals).toMatchObject({ view: 0, click: 0, wa_order: 0, conversionRate: 0 });
    });

    it('calculates conversionRate correctly with existing analytics data', async () => {
      const now = new Date();
      await Analytics.insertMany([
        { storeId, eventType: 'view', ipHash: 'hash1', userAgent: '', createdAt: now },
        { storeId, eventType: 'view', ipHash: 'hash2', userAgent: '', createdAt: now },
        { storeId, eventType: 'wa_order', ipHash: 'hash3', userAgent: '', createdAt: now },
      ]);

      const res = await request(app)
        .get(`/api/analytics/summary?storeId=${storeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.totals.view).toBe(2);
      expect(res.body.data.totals.wa_order).toBe(1);
      expect(res.body.data.totals.conversionRate).toBe(50);
    });

    it('supports weekly granularity', async () => {
      const res = await request(app)
        .get(`/api/analytics/summary?storeId=${storeId}&granularity=weekly`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.granularity).toBe('weekly');
    });

    it('supports custom startDate and endDate params', async () => {
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const end = new Date().toISOString();

      const res = await request(app)
        .get(`/api/analytics/summary?storeId=${storeId}&startDate=${start}&endDate=${end}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('startDate');
      expect(res.body.data).toHaveProperty('endDate');
    });
  });
});
