const express = require('express');
const { create, getAll, getById, update, remove, uploadProductImages } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSchema, updateSchema, querySchema, idParamSchema } = require('../validators/product');

const router = express.Router();

// POST /api/products/images — must be registered before /:id to avoid route conflict
router.post('/images', protect, ...uploadProductImages);

router
  .route('/')
  .get(validate(querySchema, 'query'), getAll)
  .post(protect, validate(createSchema), create);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), getById)
  .patch(protect, validate(idParamSchema, 'params'), validate(updateSchema), update)
  .delete(protect, validate(idParamSchema, 'params'), remove);

module.exports = router;
