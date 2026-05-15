const express = require('express');
const { uploadSingle, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, ...uploadSingle);
router.delete('/:publicId', protect, deleteImage);

module.exports = router;
