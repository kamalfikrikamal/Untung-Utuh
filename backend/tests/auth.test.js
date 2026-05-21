const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth Routes', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /api/auth/register', () => {
    it('registers a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('returns 409 for duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('returns 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 if email or password missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: testUser.email });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user profile when authenticated', async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      const token = regRes.body.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
    });

    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });

    it('returns 401 when user no longer exists after token issued', async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      const token = regRes.body.token;

      // Delete the user from the DB to simulate the "user no longer exists" path
      const User = require('../src/models/User');
      await User.deleteOne({ email: testUser.email });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('no longer exists');
    });

    it('calls next(err) when jwt.verify throws an invalid token error', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.jwt.token');
      // errorHandler converts the jwt error to a response (typically 401 or 500)
      expect([401, 500]).toContain(res.statusCode);
    });
  });

  describe('User model', () => {
    it('does not re-hash password when saving non-password fields', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const User = require('../src/models/User');
      const user = await User.findOne({ email: testUser.email }).select('+password');
      const originalHash = user.password;

      user.name = 'Updated Name';
      await user.save(); // isModified('password') === false → skip rehash

      const updated = await User.findOne({ email: testUser.email }).select('+password');
      expect(updated.password).toBe(originalHash);
    });
  });
});
