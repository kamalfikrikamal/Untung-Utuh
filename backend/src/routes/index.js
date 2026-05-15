const express = require('express');

const router = express.Router();

router.use(require('./health'));
router.use(require('./sitemap'));
router.use('/auth', require('./auth'));
router.use('/upload', require('./upload'));

module.exports = router;
