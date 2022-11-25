const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    folder:"productImages",
    allowedFormats:['jpg','jpeg','png'],
});

const upload = multer({ storage: storage}).single('product_image');

module.exports = upload;