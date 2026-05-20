const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  // v8: standardHeaders accepts true (RateLimit draft-8) or false — string values removed
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  skip: (req) => req.url === '/health',
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again after an hour.',
  },
});

/**
 * Tight limiter for the public analytics/track endpoint.
 * Keyed on IP + storeId so legitimate multi-store clients are not penalised.
 */
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 30 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.body?.storeId || ''}`,
  message: {
    status: 'error',
    message: 'Too many tracking requests, please slow down.',
  },
});

module.exports = { rateLimiter, authLimiter, analyticsLimiter };
