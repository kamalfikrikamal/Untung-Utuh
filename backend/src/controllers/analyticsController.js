const crypto  = require('crypto');
const { Types } = require('mongoose');
const Analytics = require('../models/Analytics');
const Store     = require('../models/Store');
const logger    = require('../config/logger');

// ── Helpers ────────────────────────────────────────────────────────────────

/** One-way SHA-256 hash of a client IP — no PII stored */
function hashIp(ip) {
  return crypto.createHash('sha256').update(ip || '').digest('hex');
}

/**
 * Extract the real client IP.
 * trust proxy is enabled in app.js, so req.ip is already resolved through
 * X-Forwarded-For if present.
 */
function getClientIp(req) {
  return req.ip || req.socket?.remoteAddress || '';
}

// ── Controllers ────────────────────────────────────────────────────────────

/**
 * POST /api/analytics/track
 * Public endpoint — heavily rate-limited.
 *
 * Responds immediately with 202 and defers the DB write via setImmediate
 * so the write never blocks response latency.
 */
async function track(req, res) {
  const { storeId, productId = null, eventType } = req.body;

  // Lightweight existence check — only fetches _id field
  const storeExists = await Store.exists({ _id: storeId, isActive: true });
  if (!storeExists) {
    return res.status(404).json({ status: 'error', message: 'Store not found' });
  }

  const ipHash    = hashIp(getClientIp(req));
  const userAgent = (req.headers['user-agent'] || '').slice(0, 300);

  // Fire-and-forget — DB write happens after response is already sent
  setImmediate(async () => {
    try {
      await Analytics.create({ storeId, productId, eventType, ipHash, userAgent });
    } catch (err) {
      // Log internally; never surface to client
      logger.error('Analytics write failed', {
        message: err.message,
        storeId,
        eventType,
      });
    }
  });

  return res.status(202).json({ status: 'success' });
}

/**
 * GET /api/analytics/summary
 * Protected — JWT required; only the store owner may query their own analytics.
 *
 * Query params:
 *   storeId      — required, ObjectId
 *   startDate    — ISO 8601, default: 30 days ago
 *   endDate      — ISO 8601, default: now
 *   granularity  — 'daily' (default) | 'weekly'
 *
 * Returns:
 *   { totals: { view, click, wa_order, conversionRate },
 *     series: [{ period, view, click, wa_order, conversionRate }] }
 */
async function summary(req, res) {
  const { storeId, startDate, endDate, granularity = 'daily' } = req.query;

  // Ownership verification — only owner can read analytics
  const store = await Store.findOne({
    _id: storeId,
    owner: req.user._id,
    isActive: true,
  })
    .select('_id')
    .lean();

  if (!store) {
    return res.status(403).json({
      status: 'error',
      message: 'Store not found or access denied',
    });
  }

  const now   = new Date();
  const start = startDate ? new Date(startDate) : new Date(now - 30 * 24 * 60 * 60 * 1000);
  const end   = endDate   ? new Date(endDate)   : now;

  // MongoDB date-format string: %V = ISO week number (01-53), %G = ISO week-year
  const dateFormat = granularity === 'weekly' ? '%G-W%V' : '%Y-%m-%d';

  const pipeline = [
    // Stage 1: filter by store + date range
    {
      $match: {
        storeId: new Types.ObjectId(storeId),
        createdAt: { $gte: start, $lte: end },
      },
    },
    // Stage 2: count per (period × eventType)
    {
      $group: {
        _id: {
          period:    { $dateToString: { format: dateFormat, date: '$createdAt' } },
          eventType: '$eventType',
        },
        count: { $sum: 1 },
      },
    },
    // Stage 3: pivot into a single document per period
    {
      $group: {
        _id:    '$_id.period',
        events: { $push: { type: '$_id.eventType', count: '$count' } },
      },
    },
    { $sort: { _id: 1 } },
  ];

  const rows = await Analytics.aggregate(pipeline);

  // Pivot the events array into named fields
  const series = rows.map((row) => {
    const counts = { view: 0, click: 0, wa_order: 0 };
    row.events.forEach(({ type, count }) => {
      if (type in counts) counts[type] = count;
    });
    const conversionRate =
      counts.view > 0
        ? Number(((counts.wa_order / counts.view) * 100).toFixed(2))
        : 0;
    return { period: row._id, ...counts, conversionRate };
  });

  // Roll up totals across the entire requested range
  const totals = series.reduce(
    (acc, row) => {
      acc.view     += row.view;
      acc.click    += row.click;
      acc.wa_order += row.wa_order;
      return acc;
    },
    { view: 0, click: 0, wa_order: 0 }
  );
  totals.conversionRate =
    totals.view > 0
      ? Number(((totals.wa_order / totals.view) * 100).toFixed(2))
      : 0;

  return res.json({
    status: 'success',
    data: {
      storeId,
      granularity,
      startDate: start,
      endDate: end,
      totals,
      series,
    },
  });
}

module.exports = { track, summary };
