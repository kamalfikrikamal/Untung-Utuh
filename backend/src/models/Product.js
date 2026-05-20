const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = ['electronics', 'fashion', 'food', 'health', 'home', 'sports', 'toys', 'other'];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
      },
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for store + isActive queries
productSchema.index({ store: 1, isActive: 1 });
// Descending index for newest-first sorting
productSchema.index({ createdAt: -1 });
// Full-text search on name and description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
