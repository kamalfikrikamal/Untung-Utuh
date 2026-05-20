const { z } = require('zod');

const createStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Store name cannot exceed 100 characters').trim(),
  description: z.string().max(500).trim().nullable().optional(),
  whatsapp: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, 'whatsapp must be a valid phone number (8–15 digits)')
    .nullable()
    .optional(),
});

module.exports = { createStoreSchema };
