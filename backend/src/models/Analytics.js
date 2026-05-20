const { Schema, model } = require('mongoose');

const analyticsSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    eventType: {
      type: String,
      enum: ['view', 'click', 'wa_order'],
      required: true,
    },
    // SHA-256 hash of the client IP — never stored in plaintext
    ipHash: {
      type: String,
      required: true,
      select: false, // excluded from all queries by default
    },
    // Truncated to 300 chars; device fingerprinting only, no PII
    userAgent: {
      type: String,
      default: '',
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// ── Indexes ────────────────────────────────────────────────────────────────

// Primary aggregation path: store + event type over time
analyticsSchema.index({ storeId: 1, eventType: 1, createdAt: -1 });

// Product-level drill-down
analyticsSchema.index({ storeId: 1, productId: 1, createdAt: -1 });

// TTL: auto-delete raw event documents after 90 days to control storage size
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = model('Analytics', analyticsSchema);
