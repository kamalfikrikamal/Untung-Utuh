describe('connectDB', () => {
  let mockLogger;
  let mockMongoose;
  let mockExit;

  beforeEach(() => {
    jest.resetModules();

    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
    mockMongoose = {
      connect: jest.fn(),
      connection: { on: jest.fn() },
    };

    jest.doMock('../src/config/logger', () => mockLogger);
    jest.doMock('mongoose', () => mockMongoose);

    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

  it('logs error and exits when MONGODB_URI is missing', async () => {
    const savedUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    // connect is still mocked to resolve so execution doesn't throw after the no-op exit
    mockMongoose.connect.mockResolvedValueOnce({ connection: { host: 'localhost' } });

    const connectDB = require('../src/config/database');
    await connectDB();

    expect(mockLogger.error).toHaveBeenCalledWith(
      'MONGODB_URI is not defined in environment variables'
    );
    expect(mockExit).toHaveBeenCalledWith(1);
    process.env.MONGODB_URI = savedUri;
  });

  it('logs success and registers event listeners on connection', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost/testdb';
    mockMongoose.connect.mockResolvedValueOnce({
      connection: { host: 'localhost:27017' },
    });

    const connectDB = require('../src/config/database');
    await connectDB();

    expect(mockLogger.info).toHaveBeenCalledWith(
      'MongoDB connected: localhost:27017'
    );
    expect(mockMongoose.connection.on).toHaveBeenCalledWith(
      'disconnected',
      expect.any(Function)
    );
    expect(mockMongoose.connection.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });

  it('logs error and exits on connection failure', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost/testdb';
    mockMongoose.connect.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const connectDB = require('../src/config/database');
    await connectDB();

    expect(mockLogger.error).toHaveBeenCalledWith(
      'MongoDB connection error: ECONNREFUSED'
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('disconnected event handler logs a warning', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost/testdb';
    mockMongoose.connect.mockResolvedValueOnce({
      connection: { host: 'localhost' },
    });

    const connectDB = require('../src/config/database');
    await connectDB();

    const [, handler] = mockMongoose.connection.on.mock.calls.find(
      ([event]) => event === 'disconnected'
    );
    handler();

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('disconnected')
    );
  });

  it('error event handler logs the error message', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost/testdb';
    mockMongoose.connect.mockResolvedValueOnce({
      connection: { host: 'localhost' },
    });

    const connectDB = require('../src/config/database');
    await connectDB();

    const [, handler] = mockMongoose.connection.on.mock.calls.find(
      ([event]) => event === 'error'
    );
    handler(new Error('disk full'));

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('disk full')
    );
  });
});
