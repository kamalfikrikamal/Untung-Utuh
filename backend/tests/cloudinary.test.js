describe('cloudinary config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('configures cloudinary with env vars and exports the instance', () => {
    const mockConfig = jest.fn();
    jest.doMock('cloudinary', () => ({
      v2: { config: mockConfig, api: { ping: jest.fn().mockResolvedValue({}) } },
    }));
    jest.doMock('../src/config/logger', () => ({
      info: jest.fn(),
      warn: jest.fn(),
    }));

    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    const cloudinary = require('../src/config/cloudinary');

    expect(mockConfig).toHaveBeenCalledWith({
      cloud_name: 'test-cloud',
      api_key: 'test-key',
      api_secret: 'test-secret',
      secure: true,
    });
    expect(cloudinary).toBeDefined();
  });

  it('logs success when Cloudinary ping succeeds', async () => {
    const mockPing = jest.fn().mockResolvedValue({ status: 'ok' });
    const mockInfo = jest.fn();
    jest.doMock('cloudinary', () => ({
      v2: { config: jest.fn(), api: { ping: mockPing } },
    }));
    jest.doMock('../src/config/logger', () => ({
      info: mockInfo,
      warn: jest.fn(),
    }));

    const savedEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    require('../src/config/cloudinary');
    await new Promise((resolve) => setImmediate(resolve));

    process.env.NODE_ENV = savedEnv;

    expect(mockInfo).toHaveBeenCalledWith('Cloudinary connected successfully');
  });

  it('logs warning when Cloudinary ping fails', async () => {
    const mockPing = jest.fn().mockRejectedValue(new Error('connection refused'));
    const mockWarn = jest.fn();
    jest.doMock('cloudinary', () => ({
      v2: { config: jest.fn(), api: { ping: mockPing } },
    }));
    jest.doMock('../src/config/logger', () => ({
      info: jest.fn(),
      warn: mockWarn,
    }));

    const savedEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    require('../src/config/cloudinary');
    await new Promise((resolve) => setImmediate(resolve));

    process.env.NODE_ENV = savedEnv;

    expect(mockWarn).toHaveBeenCalledWith(
      expect.stringContaining('connection refused')
    );
  });
});
