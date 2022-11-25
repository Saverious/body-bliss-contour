const express = require('express');
const router = express.Router();

const{ cartPage } = require('../controllers/cartController');

router.get('/cart',cartPage);

module.exports = router;