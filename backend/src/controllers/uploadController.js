const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { Readable } = require('node:stream');

// Custom Cloudinary multer storage engine (multer v2 + cloudinary v2)
// multer v2: file.stream is a Web Streams ReadableStream → convert to Node.js Readable first
const cloudinaryStorage = {
  _handleFile(req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
    }

    const folder = `${process.env.CLOUDINARY_FOLDER || 'mern-app'}/${req.user ? req.user._id : 'public'}`;
    const publicId = `${Date.now()}-${file.originalname.split('.')[0].replaceAll(' ', '_')}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }],
      },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
          mimetype: file.mimetype,
        });
      }
    );

    // multer v2 provides a Web Streams ReadableStream; convert to Node.js Readable before piping
    const nodeStream = file.stream instanceof ReadableStream
      ? Readable.fromWeb(file.stream)
      : file.stream;
    nodeStream.pipe(uploadStream);
  },
  _removeFile(_req, file, cb) {
    cloudinary.uploader.destroy(file.filename, cb);
  },
};

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed'), false);
  }
};

const upload = multer({
  storage: cloudinaryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadSingle = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    res.status(201).json({
      status: 'success',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.mimetype,
        size: req.file.size,
      },
    });
  },
];

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({ status: 'error', message: 'publicId is required' });
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ status: 'success', message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadSingle, deleteImage };
