const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload=multer();

const{ inboundMail } = require('../controllers/contactController');

router.post('/inquiry',upload.none(),inboundMail);

module.exports = router;