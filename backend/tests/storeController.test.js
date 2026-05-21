const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongod;
let token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Store Owner',
    email: 'owner@example.com',
    password: 'Password123!',
  });
  token = res.body.token;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Store Routes', () => {
  describe('POST /api/stores', () => {
    it('creates a store and auto-generates a slug', async () => {
      const res = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'My Awesome Store' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.store).toHaveProperty('name', 'My Awesome Store');
      expect(res.body.data.store.slug).toMatch(/^my-awesome-store-/);
    });

    it('creates a store with optional description and whatsapp', async () => {
      const res = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Full Store', description: 'A great store', whatsapp: '+6281234567890' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.store.description).toBe('A great store');
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app).post('/api/stores').send({ name: 'Unauth Store' });
      expect(res.statusCode).toBe(401);
    });

    it('returns 422 for missing name', async () => {
      const res = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(422);
    });

    it('returns 422 for invalid whatsapp number', async () => {
      const res = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Store', whatsapp: 'not-a-number' });
      expect(res.statusCode).toBe(422);
    });
  });

  describe('GET /api/stores/my', () => {
    it('returns the owner\'s stores', async () => {
      await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Store Alpha' });

      const res = await request(app)
        .get('/api/stores/my')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.stores).toHaveLength(1);
      expect(res.body.data.stores[0].name).toBe('Store Alpha');
    });

    it('returns empty array when owner has no stores', async () => {
      const res = await request(app)
        .get('/api/stores/my')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.stores).toHaveLength(0);
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app).get('/api/stores/my');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/stores/:slug', () => {
    it('returns a store by slug', async () => {
      const created = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Slug Store' });
      const { slug } = created.body.data.store;

      const res = await request(app).get(`/api/stores/${slug}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.store.slug).toBe(slug);
    });

    it('returns 404 for a non-existent slug', async () => {
      const res = await request(app).get('/api/stores/no-such-store-xyz');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Error paths (covers next(err) catch blocks)', () => {
    const Store = require('../src/models/Store');

    it('returns 500 when Store.create throws', async () => {
      const spy = jest.spyOn(Store, 'create').mockRejectedValueOnce(new Error('DB failure'));
      const res = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Error Store' });
      expect([500, 503]).toContain(res.statusCode);
      spy.mockRestore();
    });

    it('returns 500 when Store.find throws', async () => {
      const spy = jest.spyOn(Store, 'find').mockImplementationOnce(() => {
        throw new Error('DB failure');
      });
      const res = await request(app)
        .get('/api/stores/my')
        .set('Authorization', `Bearer ${token}`);
      expect([500, 503]).toContain(res.statusCode);
      spy.mockRestore();
    });

    it('returns 500 when Store.findOne throws', async () => {
      const spy = jest.spyOn(Store, 'findOne').mockRejectedValueOnce(new Error('DB failure'));
      const res = await request(app).get('/api/stores/some-slug');
      expect([500, 503]).toContain(res.statusCode);
      spy.mockRestore();
    });
  });
});
