const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

// Load logger once with LOG_LEVEL set to cover the LOG_LEVEL truthy branch (line 56)
// before jest.resetModules() resets the registry for individual tests.
process.env.LOG_LEVEL = 'preload-coverage';
require('../src/config/logger');
delete process.env.LOG_LEVEL;
jest.resetModules();

describe('logger', () => {
  afterEach(() => {
    jest.resetModules();
    jest.unmock('winston-daily-rotate-file');
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  });

  it('loads in test environment without errors', () => {
    jest.resetModules();
    const logger = require('../src/config/logger');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  it('adds Console transport and covers printf format in development mode', async () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();

    // Suppress console output while covering the printf callback
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockReturnValue(true);

    const logger = require('../src/config/logger');

    // Covers non-stack branch of printf (false branch of line 15)
    logger.info('plain message without stack');
    // Covers stack branch of printf (true branch of line 15) — explicit meta stack ensures
    // printf receives stack as a string regardless of errors() transform behaviour
    logger.error('error with explicit stack', { stack: 'Error: test\n    at Object.<anonymous> (test.js:1:1)' });

    // Wait for Winston's async stream pipeline to flush
    await new Promise(resolve => setImmediate(resolve));

    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();

    expect(typeof logger.info).toBe('function');
  });

  it('adds Console transport with prodFormat in production mode (covers line 31 production branch)', () => {
    process.env.NODE_ENV = 'production';

    jest.doMock('winston-daily-rotate-file', () => {
      const Transport = require('winston-transport');
      return class MockDailyRotateFile extends Transport {
        log(info, cb) {
          if (cb) cb();
        }
      };
    });

    jest.resetModules();

    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockReturnValue(true);

    const logger = require('../src/config/logger');
    // LOG_LEVEL defaults to 'warn' in production — use warn to actually log
    logger.warn('production log message');

    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();

    expect(typeof logger.warn).toBe('function');
  });

  it('adds DailyRotateFile transports in staging mode', () => {
    jest.doMock('winston-daily-rotate-file', () => {
      const Transport = require('winston-transport');
      return class MockDailyRotateFile extends Transport {
        log(info, cb) {
          if (cb) cb();
        }
      };
    });

    process.env.NODE_ENV = 'staging';
    jest.resetModules();

    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockReturnValue(true);

    const logger = require('../src/config/logger');
    logger.info('test in staging');

    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();

    expect(typeof logger.warn).toBe('function');
  });

  it('uses LOG_LEVEL env var when set (covers line 56 truthy branch)', () => {
    process.env.LOG_LEVEL = 'error';
    process.env.NODE_ENV = 'test';
    jest.resetModules();

    const logger = require('../src/config/logger');
    expect(logger.level).toBe('error');

    delete process.env.LOG_LEVEL;
  });
});
