const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

// Mock cloudinary before the module is loaded by the app.
// NOTE: jest.mock factories cannot reference out-of-scope variables; use require() inside.
// productController uses upload_stream via uploadBufferToCloudinary:
// it calls stream.end(buffer), so the mock object just needs an 'end' method.
jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((options, cb) => ({
      end: (buffer) =>
        setImmediate(() =>
          cb(null, {
            secure_url: 'https://res.cloudinary.com/test/image.jpg',
            public_id: 'products/test-123',
          })
        ),
    })),
  },
}));

let mongod;
let token;
let otherToken;
let storeId;

const Product = require('../src/models/Product');

const testProduct = {
  name: 'Test Product',
  price: 50000,
  stock: 10,
  category: 'electronics',
  images: [],
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Register users and create the store once for all tests
  const sellerRes = await request(app).post('/api/auth/register').send({
    name: 'Seller',
    email: 'seller@example.com',
    password: 'Password123!',
  });
  token = sellerRes.body.token;

  const otherRes = await request(app).post('/api/auth/register').send({
    name: 'Other User',
    email: 'other@example.com',
    password: 'Password123!',
  });
  otherToken = otherRes.body.token;

  const storeRes = await request(app)
    .post('/api/stores')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Product Store' });
  storeId = storeRes.body.data.store._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Only products change between tests; users and store persist for the whole file.
afterEach(async () => {
  await Product.deleteMany({});
});

// Helper: create a product for the authenticated seller
async function createProduct(overrides = {}) {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...testProduct, store: storeId, ...overrides });
  return res.body.data.product;
}

describe('Product Routes', () => {
  describe('POST /api/products', () => {
    it('creates a product successfully', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testProduct, store: storeId });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.product).toHaveProperty('name', 'Test Product');
      expect(res.body.data.product).toHaveProperty('store');
    });

    it('returns 403 when store is not owned by user', async () => {
      const foreignStoreId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...testProduct, store: foreignStoreId });

      expect(res.statusCode).toBe(403);
    });

    it('returns 422 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Incomplete Product' });

      expect(res.statusCode).toBe(422);
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ ...testProduct, store: storeId });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await createProduct();
    });

    it('returns all products with pagination', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.pagination).toHaveProperty('total', 1);
    });

    it('filters by store', async () => {
      const res = await request(app).get(`/api/products?store=${storeId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products).toHaveLength(1);
    });

    it('filters by category', async () => {
      const res = await request(app).get('/api/products?category=electronics');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products).toHaveLength(1);
    });

    it('filters by isActive=false returns empty list', async () => {
      const res = await request(app).get('/api/products?isActive=false');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products).toHaveLength(0);
    });

    it('respects custom page and limit params', async () => {
      const res = await request(app).get('/api/products?page=1&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.pagination).toHaveProperty('limit', 5);
    });

    it('returns 422 for unknown query params', async () => {
      const res = await request(app).get('/api/products?unknownParam=value');
      expect(res.statusCode).toBe(422);
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns a product by id', async () => {
      const product = await createProduct();
      const res = await request(app).get(`/api/products/${product._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.product._id).toBe(product._id);
    });

    it('returns 404 for a non-existent product id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/products/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });

    it('returns 422 for an invalid ObjectId format', async () => {
      const res = await request(app).get('/api/products/not-valid-id');
      expect(res.statusCode).toBe(422);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('updates product fields', async () => {
      const product = await createProduct();
      const res = await request(app)
        .patch(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', price: 75000 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.product.name).toBe('Updated Name');
      expect(res.body.data.product.price).toBe(75000);
    });

    it('returns 404 for a non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .patch(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(404);
    });

    it('returns 403 when user is not the store owner', async () => {
      const product = await createProduct();

      const res = await request(app)
        .patch(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ name: 'Hacked' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('soft-deletes (deactivates) the product', async () => {
      const product = await createProduct();
      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product deactivated successfully');
    });

    it('returns 404 for a non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('returns 403 when user is not the store owner', async () => {
      const product = await createProduct();

      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/products/images', () => {
    it('uploads product images via cloudinary and returns URLs', async () => {
      const res = await request(app)
        .post('/api/products/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', Buffer.from('fake image data'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.images).toHaveLength(1);
      expect(res.body.data.images[0]).toHaveProperty('url');
      expect(res.body.data.images[0]).toHaveProperty('publicId');
    });

    it('returns 400 when no files are uploaded', async () => {
      const res = await request(app)
        .post('/api/products/images')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });

    it('handles cloudinary upload Error instance and returns 500', async () => {
      const cloudinary = require('../src/config/cloudinary');
      cloudinary.uploader.upload_stream.mockImplementationOnce((options, cb) => ({
        end: (buffer) => setImmediate(() => cb(new Error('Cloudinary upload failed'), null)),
      }));

      const res = await request(app)
        .post('/api/products/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', Buffer.from('data'), {
          filename: 'fail.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(500);
    });

    it('handles cloudinary string error and returns 500', async () => {
      const cloudinary = require('../src/config/cloudinary');
      cloudinary.uploader.upload_stream.mockImplementationOnce((options, cb) => ({
        end: (buffer) => setImmediate(() => cb('string error from cloudinary', null)),
      }));

      const res = await request(app)
        .post('/api/products/images')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', Buffer.from('data'), {
          filename: 'fail2.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(500);
    });
  });
});
