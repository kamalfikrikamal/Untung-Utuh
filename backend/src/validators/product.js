const { z } = require('zod');

const CATEGORIES = ['electronics', 'fashion', 'food', 'health', 'home', 'sports', 'toys', 'other'];

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

const objectIdSchema = (field) =>
  z.string({ required_error: `${field} is required` }).regex(OBJECT_ID_RE, `Invalid ${field}`);

const imageSchema = z.object({
  url: z.url({ error: 'Image url must be a valid URL' }),
  publicId: z.string().min(1, 'Image publicId is required'),
});

// POST /api/products
const createSchema = z.object({
  store: objectIdSchema('store'),
  name: z.string().min(1, 'Name is required').max(200).trim(),
  description: z.string().max(2000).trim().nullable().optional(),
  price: z.number({ invalid_type_error: 'Price must be a number' }).min(0, 'Price cannot be negative'),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  category: z.enum(CATEGORIES, { error: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  images: z.array(imageSchema).max(10, 'Maximum 10 images allowed').default([]),
});

// PATCH /api/products/:id  — every field optional, store immutable
const updateSchema = createSchema.omit({ store: true }).partial();

// GET /api/products  — query string params (all strings from URL)
const querySchema = z
  .object({
    store: objectIdSchema('store').optional(),
    category: z.enum(CATEGORIES).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().max(100).trim().optional(),
    page: z
      .string()
      .regex(/^\d+$/, 'page must be a positive integer')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'limit must be a positive integer')
      .optional(),
  })
  .strict(); // reject unknown query parameters

// POST /api/products/images  — multipart handled by multer; no body schema needed
// DELETE /api/products/:id and GET /api/products/:id  — param validation
const idParamSchema = z.object({ id: objectIdSchema('id') });

module.exports = { createSchema, updateSchema, querySchema, idParamSchema };
