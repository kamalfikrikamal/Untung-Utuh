const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Store = require('../src/models/Store');

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
  await Store.deleteMany({});
});

describe('Store model', () => {
  const ownerId = new mongoose.Types.ObjectId();

  it('auto-generates slug from name on first save', async () => {
    const store = await Store.create({ name: 'My Cool Store', owner: ownerId });
    expect(store.slug).toMatch(/^my-cool-store-[a-f0-9]{6}$/);
  });

  it('slug contains last 6 chars of the ObjectId', async () => {
    const store = await Store.create({ name: 'Test Store', owner: ownerId });
    const suffix = store._id.toString().slice(-6);
    expect(store.slug).toBe(`test-store-${suffix}`);
  });

  it('does not overwrite slug when one is already set', async () => {
    const store = await Store.create({
      name: 'Test Store',
      slug: 'my-custom-slug',
      owner: ownerId,
    });
    expect(store.slug).toBe('my-custom-slug');
  });

  it('replaces spaces and special chars with hyphens in slug', async () => {
    const store = await Store.create({ name: 'Hello & World!', owner: ownerId });
    expect(store.slug).toMatch(/^hello-world-/);
  });

  it('strips leading and trailing hyphens from slug base', async () => {
    const store = await Store.create({ name: '---Cool Store---', owner: ownerId });
    expect(store.slug).toMatch(/^cool-store-/);
  });

  it('removes __v from toJSON output', async () => {
    const store = await Store.create({ name: 'JSON Test', owner: ownerId });
    const json = store.toJSON();
    expect(json.__v).toBeUndefined();
    expect(json._id).toBeDefined();
  });

  it('defaults isActive to true', async () => {
    const store = await Store.create({ name: 'Active Store', owner: ownerId });
    expect(store.isActive).toBe(true);
  });

  it('rejects saving without required owner field', async () => {
    await expect(Store.create({ name: 'No Owner' })).rejects.toThrow();
  });

  it('rejects saving without required name field', async () => {
    await expect(Store.create({ owner: ownerId })).rejects.toThrow();
  });
});
