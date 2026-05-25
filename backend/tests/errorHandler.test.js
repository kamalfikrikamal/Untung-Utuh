const { z } = require('zod');

jest.mock('../src/config/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
}));

const errorHandler = require('../src/middleware/errorHandler');
const logger = require('../src/config/logger');

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { originalUrl: '/api/test', method: 'GET', ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('handles generic error with status 500', () => {
    const err = new Error('something broke');
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'something broke' })
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('uses err.statusCode when present and < 500', () => {
    const err = new Error('not found');
    err.statusCode = 404;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('uses default Internal Server Error message when no message on error', () => {
    const err = {};
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal Server Error' })
    );
  });

  it('handles ZodError with 422 and validation errors', () => {
    let zodErr;
    try {
      z.string().parse(123);
    } catch (e) {
      zodErr = e;
    }
    errorHandler(zodErr, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation failed',
        errors: expect.any(Array),
      })
    );
  });

  it('handles LIMIT_FILE_SIZE error with 413', () => {
    const err = new Error('File too large');
    err.code = 'LIMIT_FILE_SIZE';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'File size exceeds the 5 MB limit' })
    );
  });

  it('handles MongoDB duplicate key error (code 11000) with 409', () => {
    const err = new Error('duplicate key error');
    err.code = 11000;
    err.keyValue = { email: 'test@example.com' };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Duplicate value for field: email' })
    );
  });

  it('handles duplicate key error with empty keyValue', () => {
    const err = new Error('duplicate key error');
    err.code = 11000;
    err.keyValue = {};
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('handles duplicate key error when keyValue is undefined (covers || {} fallback)', () => {
    const err = new Error('duplicate key error');
    err.code = 11000;
    // err.keyValue is undefined — triggers the || {} fallback
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Duplicate value for field: undefined' })
    );
  });

  it('handles Mongoose ValidationError with 422', () => {
    const err = new Error('validation failed');
    err.name = 'ValidationError';
    err.errors = {
      name: { message: 'Name is required' },
      email: { message: 'Email is invalid' },
    };
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Name is required') })
    );
  });

  it('handles Mongoose CastError with 400', () => {
    const err = new Error('cast error');
    err.name = 'CastError';
    err.path = 'id';
    err.value = 'invalid-id';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid id: invalid-id' })
    );
  });

  it('handles JsonWebTokenError with 401', () => {
    const err = new Error('jwt malformed');
    err.name = 'JsonWebTokenError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid token. Please log in again.' })
    );
  });

  it('handles TokenExpiredError with 401', () => {
    const err = new Error('jwt expired');
    err.name = 'TokenExpiredError';
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Token expired. Please log in again.' })
    );
  });

  it('handles CORS error with 403', () => {
    const err = new Error('CORS policy violation');
    err.statusCode = 403;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('includes stack in development environment', () => {
    const savedEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const err = new Error('dev error');
    err.statusCode = 400;
    errorHandler(err, req, res, next);
    const jsonPayload = res.json.mock.calls[0][0];
    expect(jsonPayload.stack).toBeDefined();
    process.env.NODE_ENV = savedEnv;
  });

  it('does not include stack in non-development environment', () => {
    const savedEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    const err = new Error('prod error');
    err.statusCode = 400;
    errorHandler(err, req, res, next);
    const jsonPayload = res.json.mock.calls[0][0];
    expect(jsonPayload.stack).toBeUndefined();
    process.env.NODE_ENV = savedEnv;
  });
});
