import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUploadProductImages } from '@/hooks/useProducts';

const CATEGORIES = [
  'electronics',
  'fashion',
  'food',
  'health',
  'home',
  'sports',
  'toys',
  'other',
];

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '' };

function toFormValues(product) {
  if (!product) return EMPTY_FORM;
  return {
    name: product.name ?? '',
    description: product.description ?? '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    category: product.category ?? '',
  };
}

export default function ProductForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(() => toFormValues(initial));
  // serverImages: already-uploaded images from the server
  const [serverImages, setServerImages] = useState(initial?.images ?? []);
  // localFiles: new files selected by the user, not yet uploaded
  const [localFiles, setLocalFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { mutateAsync: uploadImages, isPending: uploading } = useUploadProductImages();

  // Re-initialise when switching between create/edit
  useEffect(() => {
    setForm(toFormValues(initial));
    setServerImages(initial?.images ?? []);
    setLocalFiles([]);
  }, [initial]);

  // Revoke blob URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => localFiles.forEach((lf) => URL.revokeObjectURL(lf.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!valid.length) return;
    const entries = valid.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setLocalFiles((prev) => [...prev, ...entries]);
  }, []);

  const removeServerImage = (idx) => setServerImages((prev) => prev.filter((_, i) => i !== idx));

  const removeLocalFile = (idx) => {
    URL.revokeObjectURL(localFiles[idx].preview);
    setLocalFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newImages = [];
    if (localFiles.length > 0) {
      const result = await uploadImages(localFiles.map((lf) => lf.file));
      newImages = result.data.images;
    }
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: [...serverImages, ...newImages],
    });
  };

  const allPreviews = [
    ...serverImages.map((img) => ({ url: img.url, type: 'server' })),
    ...localFiles.map((lf) => ({ url: lf.preview, type: 'local' })),
  ];
  const serverCount = serverImages.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="product-name" className="block text-sm text-slate-400 mb-1">
          Product Name <span className="text-red-400">*</span>
        </label>
        <input
          id="product-name"
          value={form.name}
          onChange={set('name')}
          required
          maxLength={200}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="product-description" className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea
          id="product-description"
          value={form.description}
          onChange={set('description')}
          rows={3}
          maxLength={2000}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Describe your product…"
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="product-price" className="block text-sm text-slate-400 mb-1">
            Price (IDR) <span className="text-red-400">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            value={form.price}
            onChange={set('price')}
            required
            min={0}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="product-stock" className="block text-sm text-slate-400 mb-1">
            Stock <span className="text-red-400">*</span>
          </label>
          <input
            id="product-stock"
            type="number"
            value={form.stock}
            onChange={set('stock')}
            required
            min={0}
            step={1}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="product-category" className="block text-sm text-slate-400 mb-1">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          id="product-category"
          value={form.category}
          onChange={set('category')}
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Image Drag-and-Drop */}
      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Images{' '}
          <span className="text-slate-600 font-normal">
            ({allPreviews.length}/10)
          </span>
        </label>

        {allPreviews.length < 10 && (
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            aria-label="Upload product images"
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => addFiles(e.target.files)}
            />
            <p className="text-slate-400 text-sm">
              Drag &amp; drop images here, or{' '}
              <span className="text-blue-400 underline">browse</span>
            </p>
            <p className="text-slate-600 text-xs mt-1">
              JPG, PNG, WebP, GIF · max 5 MB each · up to 10 images
            </p>
          </div>
        )}

        {/* Previews */}
        {allPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {allPreviews.map((img, idx) => (
              <div key={idx} className="relative group aspect-square">
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg border border-slate-700"
                />
                <button
                  type="button"
                  onClick={() =>
                    idx < serverCount ? removeServerImage(idx) : removeLocalFile(idx - serverCount)
                  }
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
      >
        {uploading ? 'Uploading images…' : loading ? 'Saving…' : 'Save Product'}
      </button>
    </form>
  );
}

ProductForm.propTypes = {
  initial: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    category: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string.isRequired })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
