const express = require('express');
const { createStore, getMyStores, getStoreBySlug } = require('../controllers/storeController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createStoreSchema } = require('../validators/store');

const router = express.Router();

// Protected: create a new store
router.post('/', protect, validate(createStoreSchema), createStore);

// Protected: seller's own stores
router.get('/my', protect, getMyStores);

// Public: store profile by slug
router.get('/:slug', getStoreBySlug);

module.exports = router;
