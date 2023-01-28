const express = require('express');
const router = express.Router();

const{intasendCheckout,webHook} = require('../controllers/orderController');

router.post('/checkout',intasendCheckout);
router.post('/webhook',webHook);

module.exports=router;