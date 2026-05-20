const express = require('express');
const { protect }          = require('../middleware/auth');
const validate             = require('../middleware/validate');
const { analyticsLimiter } = require('../middleware/rateLimiter');
const { trackSchema, summaryQuerySchema } = require('../validators/analytics');
const { track, summary }   = require('../controllers/analyticsController');

const router = express.Router();

// POST /api/analytics/track  — public, strict rate limit
router.post('/track', analyticsLimiter, validate(trackSchema), track);

// GET  /api/analytics/summary — owner-only, JWT required
router.get('/summary', protect, validate(summaryQuerySchema, 'query'), summary);

module.exports = router;
