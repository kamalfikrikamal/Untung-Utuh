const { z } = require('zod');
const validate = require('../src/middleware/validate');

describe('validate middleware', () => {
  describe('body source (default)', () => {
    const schema = z.object({ name: z.string().min(1) });

    it('calls next() and replaces req.body on valid input', () => {
      const middleware = validate(schema);
      const req = { body: { name: 'Alice', extra: 'should be stripped' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body).toEqual({ name: 'Alice' });
    });

    it('returns 422 with errors array on invalid input', () => {
      const middleware = validate(schema);
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Validation failed',
          errors: expect.any(Array),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('returns source as field name when path is empty', () => {
      const schema2 = z.string().min(1);
      const middleware = validate(schema2);
      const req = { body: '' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      const errors = res.json.mock.calls[0][0].errors;
      expect(errors[0].field).toBe('body');
    });
  });

  describe('query source', () => {
    it('uses Object.defineProperty to shadow the getter on valid input', () => {
      const schema = z.object({ q: z.string() });
      const middleware = validate(schema, 'query');
      const req = { query: { q: 'search-term' } };
      const next = jest.fn();

      middleware(req, {}, next);

      expect(next).toHaveBeenCalled();
      expect(req.query).toEqual({ q: 'search-term' });
    });

    it('returns 422 for invalid query', () => {
      const schema = z.object({ q: z.string() }).strict();
      const middleware = validate(schema, 'query');
      const req = { query: { unknown: 'param' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('params source', () => {
    it('calls next() and replaces req.params on valid input', () => {
      const schema = z.object({ id: z.string() });
      const middleware = validate(schema, 'params');
      const req = { params: { id: 'abc123' } };
      const next = jest.fn();

      middleware(req, {}, next);

      expect(next).toHaveBeenCalled();
      expect(req.params).toEqual({ id: 'abc123' });
    });

    it('returns 422 for invalid params', () => {
      const schema = z.object({ id: z.string().min(10) });
      const middleware = validate(schema, 'params');
      const req = { params: { id: 'short' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
