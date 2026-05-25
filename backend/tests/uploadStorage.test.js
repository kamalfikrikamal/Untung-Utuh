/**
 * Tests for cloudinaryStorage._handleFile internals that cannot be reached
 * through the HTTP layer (dead code paths and protected routes).
 * Uses a multer mock to capture the internal cloudinaryStorage object.
 */

let capturedStorage;

jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mock multer to capture the cloudinaryStorage passed as options.storage
jest.mock('multer', () => {
  const mockFn = jest.fn((options) => {
    capturedStorage = options.storage;
    return {
      single: jest.fn(() => (_req, _res, next) => next()),
      storage: options.storage,
    };
  });
  return mockFn;
});

describe('uploadController internal cloudinaryStorage', () => {
  beforeAll(() => {
    jest.resetModules();
    require('../src/controllers/uploadController');
  });

  it('_handleFile calls cb with error when upload_stream fails', (done) => {
    const cloudinary = require('../src/config/cloudinary');
    const { PassThrough } = require('node:stream');

    cloudinary.uploader.upload_stream.mockImplementationOnce((options, cb) => {
      const pt = new PassThrough();
      setImmediate(() => cb(new Error('Cloudinary upload failed'), null));
      return pt;
    });

    const req = { user: { _id: 'user-id-123' } };
    const file = {
      mimetype: 'image/jpeg',
      originalname: 'photo.jpg',
      stream: { pipe: jest.fn() },
    };

    capturedStorage._handleFile(req, file, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Cloudinary upload failed');
      done();
    });
  });

  it('_handleFile uses public folder when req.user is absent', (done) => {
    const cloudinary = require('../src/config/cloudinary');
    const { PassThrough } = require('node:stream');
    let capturedOptions;

    cloudinary.uploader.upload_stream.mockImplementationOnce((options, cb) => {
      capturedOptions = options;
      const pt = new PassThrough();
      setImmediate(() =>
        cb(null, { secure_url: 'https://res.test/img.jpg', public_id: 'public/test', bytes: 512 })
      );
      return pt;
    });

    const req = {}; // no req.user
    const file = {
      mimetype: 'image/jpeg',
      originalname: 'img.jpg',
      stream: { pipe: jest.fn() },
    };

    capturedStorage._handleFile(req, file, (err) => {
      expect(err).toBeNull();
      expect(capturedOptions.folder).toMatch(/\/public$/);
      done();
    });
  });

  it('_handleFile converts Web ReadableStream to Node.js Readable before piping', (done) => {
    const cloudinary = require('../src/config/cloudinary');
    const { PassThrough } = require('node:stream');

    cloudinary.uploader.upload_stream.mockImplementationOnce((options, cb) => {
      const pt = new PassThrough();
      setImmediate(() =>
        cb(null, { secure_url: 'https://res.test/img.jpg', public_id: 'user/test', bytes: 256 })
      );
      return pt;
    });

    const req = { user: { _id: 'uid-456' } };

    // Provide a Web Streams ReadableStream to trigger the Readable.fromWeb() branch
    const webStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.close();
      },
    });

    const file = {
      mimetype: 'image/jpeg',
      originalname: 'web.jpg',
      stream: webStream,
    };

    capturedStorage._handleFile(req, file, (err) => {
      expect(err).toBeNull();
      done();
    });
  });

  it('_removeFile calls cloudinary.uploader.destroy with file.filename', (done) => {
    const cloudinary = require('../src/config/cloudinary');
    cloudinary.uploader.destroy.mockImplementation((_id, cb) => cb(null, { result: 'ok' }));

    const file = { filename: 'user/test-public-id' };

    capturedStorage._removeFile({}, file, (err) => {
      expect(err).toBeNull();
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('user/test-public-id', expect.any(Function));
      done();
    });
  });

  it('deleteImage returns 400 when publicId param is empty', async () => {
    jest.resetModules();
    const { deleteImage } = require('../src/controllers/uploadController');

    const req = { params: { publicId: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await deleteImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'publicId is required',
    });
  });

  it('_handleFile calls cb with error for disallowed MIME type', (done) => {
    const req = { user: { _id: 'user-123' } };
    const file = {
      mimetype: 'application/pdf',
      originalname: 'document.pdf',
      stream: { pipe: jest.fn() },
    };

    capturedStorage._handleFile(req, file, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('Only image files');
      done();
    });
  });
});
