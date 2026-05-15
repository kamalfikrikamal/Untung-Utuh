const { v2: cloudinary } = require('cloudinary');
const logger = require('./logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const verifyCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('Cloudinary connected successfully');
  } catch (error) {
    logger.warn(`Cloudinary connection warning: ${error.message}`);
  }
};

if (process.env.NODE_ENV !== 'test') {
  verifyCloudinaryConnection();
}

module.exports = cloudinary;
