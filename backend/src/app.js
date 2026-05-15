const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const corsMiddleware = require('./middleware/cors');
const { rateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const logger = require('./config/logger');

const app = express();

// Security Headers
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://ucarecdn.com'],
    },
  },
}));

// CORS
app.use(corsMiddleware);

// Compression
app.use(compression());

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization — NoSQL Injection (Express 5 compatible)
// express-mongo-sanitize's default middleware tries to reassign req.query, which is
// a getter-only property in Express 5. We use the sanitize() function directly instead,
// mutating only req.body and req.params. req.query NoSQL injection is low-risk
// for a JSON REST API where MongoDB queries are never built directly from req.query.
app.use((req, _res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// HTTP Request Logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
  skip: (req) => req.url === '/api/health',
}));

// Rate Limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
