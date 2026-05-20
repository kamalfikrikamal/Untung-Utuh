const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const Store = require('../models/Store');

// --------------- Image Upload ---------------

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGE_COUNT = 10;

const productImageMulter = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp, gif) are allowed'), false);
    }
  },
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) {
        const error = err instanceof Error ? err : new Error(typeof err === 'string' ? err : JSON.stringify(err));
        return reject(error);
      }
      resolve(result);
    });
    stream.end(buffer);
  });

// POST /api/products/images
const uploadProductImages = [
  productImageMulter.array('images', MAX_IMAGE_COUNT),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
      }

      const folder = `${process.env.CLOUDINARY_FOLDER || 'mern-app'}/products`;

      const results = await Promise.all(
        req.files.map((file) => {
          const publicId = `${Date.now()}-${file.originalname.split('.')[0].replaceAll(' ', '_')}`;
          return uploadBufferToCloudinary(file.buffer, {
            folder,
            public_id: publicId,
            resource_type: 'image',
            transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }],
          });
        })
      );

      res.status(201).json({
        status: 'success',
        data: {
          images: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
        },
      });
    } catch (err) {
      next(err);
    }
  },
];

// --------------- Helpers ---------------

const verifyStoreOwnership = (storeId, userId) =>
  Store.findOne({ _id: storeId, owner: userId, isActive: true });

// --------------- CRUD Controllers ---------------

// POST /api/products
const create = async (req, res, next) => {
  try {
    const { store, name, description, price, stock, category, images } = req.body;

    const ownedStore = await verifyStoreOwnership(store, req.user._id);
    if (!ownedStore) {
      return res.status(403).json({ status: 'error', message: 'Store not found or access denied' });
    }

    const product = await Product.create({
      store,
      name,
      description,
      price,
      stock,
      category,
      images: images || [],
      createdBy: req.user._id,
    });

    res.status(201).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

// GET /api/products
const getAll = async (req, res, next) => {
  try {
    const { store, category, isActive, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (store) filter.store = store;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('store', 'name'),
      Product.countDocuments(filter),
    ]);

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'name owner');
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id
const update = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'owner');
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (String(product.store.owner) !== String(req.user._id)) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'images', 'isActive'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ status: 'success', data: { product: updated } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  (soft delete)
const remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'owner');
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    if (String(product.store.owner) !== String(req.user._id)) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    await Product.findByIdAndUpdate(req.params.id, { $set: { isActive: false } });

    res.json({ status: 'success', message: 'Product deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove, uploadProductImages };
