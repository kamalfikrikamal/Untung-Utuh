const Store = require('../models/Store');

// POST /api/stores  (protected)
const createStore = async (req, res, next) => {
  try {
    const store = await Store.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ status: 'success', data: { store } });
  } catch (err) {
    next(err);
  }
};

// GET /api/stores/my  (protected)
const getMyStores = async (req, res, next) => {
  try {
    const stores = await Store.find({ owner: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: { stores } });
  } catch (err) {
    next(err);
  }
};

// GET /api/stores/:slug  (public)
const getStoreBySlug = async (req, res, next) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug, isActive: true });
    if (!store) {
      return res.status(404).json({ status: 'error', message: 'Store not found' });
    }
    res.json({ status: 'success', data: { store } });
  } catch (err) {
    next(err);
  }
};

module.exports = { createStore, getMyStores, getStoreBySlug };
