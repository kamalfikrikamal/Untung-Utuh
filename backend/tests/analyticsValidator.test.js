const { trackSchema, summaryQuerySchema } = require('../src/validators/analytics');

const VALID_OID = 'a1b2c3d4e5f6a1b2c3d4e5f6'; // 24 hex chars

describe('Analytics Validators', () => {
  describe('trackSchema', () => {
    it('validates a valid view event', () => {
      const result = trackSchema.safeParse({ storeId: VALID_OID, eventType: 'view' });
      expect(result.success).toBe(true);
    });

    it('validates a click event with productId', () => {
      const result = trackSchema.safeParse({
        storeId: VALID_OID,
        productId: VALID_OID,
        eventType: 'click',
      });
      expect(result.success).toBe(true);
    });

    it('validates a wa_order event with explicit null productId', () => {
      const result = trackSchema.safeParse({
        storeId: VALID_OID,
        productId: null,
        eventType: 'wa_order',
      });
      expect(result.success).toBe(true);
    });

    it('validates without optional productId field', () => {
      const result = trackSchema.safeParse({ storeId: VALID_OID, eventType: 'click' });
      expect(result.success).toBe(true);
    });

    it('fails when storeId is missing', () => {
      const result = trackSchema.safeParse({ eventType: 'view' });
      expect(result.success).toBe(false);
      // Zod v4 reports the field-level required error message
      expect(result.error.issues.length).toBeGreaterThan(0);
    });

    it('fails when storeId is not a valid 24-char hex ObjectId', () => {
      const result = trackSchema.safeParse({ storeId: 'not-an-id', eventType: 'view' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Invalid storeId');
    });

    it('fails when eventType is invalid', () => {
      const result = trackSchema.safeParse({ storeId: VALID_OID, eventType: 'purchase' });
      expect(result.success).toBe(false);
      expect(result.error.issues.length).toBeGreaterThan(0);
    });

    it('fails when eventType is missing', () => {
      const result = trackSchema.safeParse({ storeId: VALID_OID });
      expect(result.success).toBe(false);
    });

    it('fails when productId is an invalid ObjectId format', () => {
      const result = trackSchema.safeParse({
        storeId: VALID_OID,
        productId: 'bad-id',
        eventType: 'view',
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe('Invalid productId');
    });
  });

  describe('summaryQuerySchema', () => {
    it('validates with only the required storeId and applies granularity default', () => {
      const result = summaryQuerySchema.safeParse({ storeId: VALID_OID });
      expect(result.success).toBe(true);
      expect(result.data.granularity).toBe('daily');
    });

    it('validates with all optional fields set', () => {
      const result = summaryQuerySchema.safeParse({
        storeId: VALID_OID,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        granularity: 'weekly',
      });
      expect(result.success).toBe(true);
    });

    it('fails when storeId is missing', () => {
      const result = summaryQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('fails when storeId is not a valid ObjectId', () => {
      const result = summaryQuerySchema.safeParse({ storeId: 'bad' });
      expect(result.success).toBe(false);
    });

    it('fails when startDate is not a valid ISO 8601 datetime', () => {
      const result = summaryQuerySchema.safeParse({
        storeId: VALID_OID,
        startDate: '2024-01-01',
      });
      expect(result.success).toBe(false);
    });

    it('fails when endDate is not a valid ISO 8601 datetime', () => {
      const result = summaryQuerySchema.safeParse({
        storeId: VALID_OID,
        endDate: 'not-a-date',
      });
      expect(result.success).toBe(false);
    });

    it('fails when granularity is an invalid value', () => {
      const result = summaryQuerySchema.safeParse({
        storeId: VALID_OID,
        granularity: 'monthly',
      });
      expect(result.success).toBe(false);
    });

    it('fails when unknown keys are present (strict mode)', () => {
      const result = summaryQuerySchema.safeParse({
        storeId: VALID_OID,
        unknownField: 'value',
      });
      expect(result.success).toBe(false);
    });
  });
});
