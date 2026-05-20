const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('node:path');

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    const time = typeof ts === 'string' ? ts : JSON.stringify(ts);
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    const stackStr = typeof stack === 'string' ? stack : JSON.stringify(stack);
    return stack
      ? `${time} [${level}]: ${msg}\n${stackStr}`
      : `${time} [${level}]: ${msg}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const transports = [];

if (process.env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  }));
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  transports.push(
    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: prodFormat,
    }),
    new DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: prodFormat,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
  transports,
  exitOnError: false,
});

// Add http level for morgan integration
winston.addColors({ http: 'magenta' });
logger.add(new winston.transports.Console({
  level: 'http',
  format: devFormat,
  silent: process.env.NODE_ENV === 'test',
}));

module.exports = logger;
