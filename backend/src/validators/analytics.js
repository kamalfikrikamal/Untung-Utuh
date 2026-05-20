const { z } = require('zod');

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** POST /api/analytics/track */
const trackSchema = z.object({
  storeId: z
    .string({ required_error: 'storeId is required' })
    .regex(OBJECT_ID_RE, 'Invalid storeId'),
  productId: z
    .string()
    .regex(OBJECT_ID_RE, 'Invalid productId')
    .nullable()
    .optional(),
  eventType: z.enum(['view', 'click', 'wa_order'], {
    errorMap: () => ({ message: "eventType must be 'view', 'click', or 'wa_order'" }),
  }),
});

/** GET /api/analytics/summary */
const summaryQuerySchema = z
  .object({
    storeId: z
      .string({ required_error: 'storeId is required' })
      .regex(OBJECT_ID_RE, 'Invalid storeId'),
    startDate: z.iso.datetime({ offset: true, error: 'startDate must be an ISO 8601 datetime' }).optional(),
    endDate:   z.iso.datetime({ offset: true, error: 'endDate must be an ISO 8601 datetime' }).optional(),
    granularity: z.enum(['daily', 'weekly']).default('daily'),
  })
  .strict();

module.exports = { trackSchema, summaryQuerySchema };
