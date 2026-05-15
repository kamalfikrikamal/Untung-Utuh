const express = require('express');
// sitemap v9: SitemapStream and streamToPromise still exported from main package
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const router = express.Router();

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const hostname = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.7 },
      { url: '/contact', changefreq: 'monthly', priority: 0.6 },
    ];

    const stream = new SitemapStream({ hostname });
    const xmlBuffer = await streamToPromise(Readable.from(links).pipe(stream));

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xmlBuffer.toString());
  } catch (err) {
    next(err);
  }
});

router.get('/robots.txt', (req, res) => {
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${appUrl}/sitemap.xml\n`
  );
});

module.exports = router;
