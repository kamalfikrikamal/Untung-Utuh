const { ZodError } = require('zod');

/**
 * Generic Zod validation middleware.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against.
 * @param {'body'|'params'|'query'} source - Which part of the request to validate.
 *
 * For 'body' and 'params', the validated (coerced + stripped) result replaces req[source].
 * For 'query', Express 5 exposes it as a read-only getter on the prototype, so direct
 * reassignment is not possible. Instead, Object.defineProperty is used to shadow the
 * getter with a sanitized own-property on the request instance.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed',
      errors: result.error.issues.map((e) => ({
        field: e.path.join('.') || source,
        message: e.message,
      })),
    });
  }

  if (source === 'query') {
    // Shadow the Express 5 computed getter with a static own-property
    Object.defineProperty(req, 'query', {
      value: result.data,
      writable: true,
      configurable: true,
    });
  } else {
    req[source] = result.data;
  }

  next();
};

module.exports = validate;
