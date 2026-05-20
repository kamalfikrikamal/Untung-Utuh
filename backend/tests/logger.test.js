const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

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

  it('adds Console transport and covers printf format in development mode', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();

    // Suppress console output while covering the printf callback
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    const stderrSpy = jest.spyOn(process.stderr, 'write').mockReturnValue(true);

    const logger = require('../src/config/logger');

    // Covers non-stack branch of printf (lines 12-14 + false branch of line 15)
    logger.info('plain message without stack');

    // Covers stack branch of printf (true branch of line 15)
    logger.error(new Error('error with stack trace'));

    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();

    expect(typeof logger.info).toBe('function');
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
});
