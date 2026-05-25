const request = require('supertest');
const app = require('../src/app');

describe('Sitemap and robots routes', () => {
  it('GET /api/sitemap.xml returns valid XML with urlset', async () => {
    const res = await request(app).get('/api/sitemap.xml');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/xml');
    expect(res.text).toContain('<?xml');
    expect(res.text).toContain('urlset');
  });

  it('GET /api/sitemap.xml sets cache-control header', async () => {
    const res = await request(app).get('/api/sitemap.xml');
    expect(res.statusCode).toBe(200);
    expect(res.headers['cache-control']).toContain('max-age=3600');
  });

  it('GET /api/sitemap.xml uses APP_URL env variable when set', async () => {
    process.env.APP_URL = 'https://example.com';
    const res = await request(app).get('/api/sitemap.xml');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('example.com');
    delete process.env.APP_URL;
  });

  it('GET /api/robots.txt returns plain text with User-agent directive', async () => {
    const res = await request(app).get('/api/robots.txt');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('User-agent: *');
    expect(res.text).toContain('Allow: /');
    expect(res.text).toContain('Disallow: /api/');
    expect(res.text).toContain('Sitemap:');
  });

  it('GET /api/robots.txt includes APP_URL in sitemap link', async () => {
    process.env.APP_URL = 'https://my-app.com';
    const res = await request(app).get('/api/robots.txt');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('https://my-app.com/sitemap.xml');
    delete process.env.APP_URL;
  });
});

describe('Sitemap error handling', () => {
  let appWithError;

  beforeAll(() => {
    jest.resetModules();
    jest.doMock('sitemap', () => ({
      SitemapStream: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        pipe: jest.fn().mockReturnThis(),
      })),
      streamToPromise: jest.fn().mockRejectedValue(new Error('stream failed')),
    }));
    appWithError = require('../src/app');
  });

  afterAll(() => {
    jest.resetModules();
    jest.dontMock('sitemap');
  });

  it('GET /api/sitemap.xml calls next(err) when streamToPromise rejects', async () => {
    const res = await request(appWithError).get('/api/sitemap.xml');
    expect(res.statusCode).toBe(500);
  });
});
