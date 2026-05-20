const express = require('express');

const router = express.Router();

router.use(require('./health'));
router.use(require('./sitemap'));
router.use('/auth', require('./auth'));
router.use('/upload', require('./upload'));
router.use('/stores', require('./store'));
router.use('/products', require('./product'));
router.use('/analytics', require('./analytics'));

module.exports = router;
