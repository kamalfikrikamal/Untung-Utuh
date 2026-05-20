const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

// Mock cloudinary before modules load — uploadController uses a custom storage
// engine that pipes file.stream into cloudinary.uploader.upload_stream
// NOTE: jest.mock factories cannot reference out-of-scope variables; use require() inside.
jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((options, cb) => {
      const { PassThrough } = require('node:stream');
      const pt = new PassThrough();
      pt.on('finish', () =>
        cb(null, {
          secure_url: 'https://res.cloudinary.com/demo/image/upload/test.jpg',
          public_id: 'user/test-image-id',
          bytes: 1024,
        })
      );
      return pt;
    }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
  },
}));

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
    name: 'Upload User',
    email: 'uploader@example.com',
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

describe('Upload Routes', () => {
  describe('POST /api/upload', () => {
    it('uploads a valid image and returns url/publicId', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake image content'), {
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('url');
      expect(res.body.data).toHaveProperty('publicId');
      expect(res.body.data).toHaveProperty('format');
      expect(res.body.data).toHaveProperty('size');
    });

    it('returns 400 when no image file is provided', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('No file uploaded');
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/upload')
        .attach('image', Buffer.from('fake'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(401);
    });

    it('rejects non-image file types', async () => {
      const res = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('not an image'), {
          filename: 'file.txt',
          contentType: 'text/plain',
        });

      // fileFilter rejects the file and passes error to errorHandler → 500
      expect(res.statusCode).toBe(500);
    });
  });

  describe('DELETE /api/upload/:publicId', () => {
    it('deletes an image by publicId and returns success', async () => {
      const res = await request(app)
        .delete('/api/upload/my-folder%2Ftest-image-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Image deleted');
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app).delete('/api/upload/some-public-id');
      expect(res.statusCode).toBe(401);
    });
  });
});
