require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/mern-test-debug';
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-chars-longXX';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.LOG_LEVEL = 'silent';

const app = require('./src/app');
const request = require('supertest');

(async () => {
  try {
    const r = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'Password123!' });
    console.log('STATUS:', r.status);
    console.log('BODY:', JSON.stringify(r.body, null, 2));
  } catch (e) {
    console.error('REQUEST ERROR:', e.message);
  }
  process.exit(0);
})();
