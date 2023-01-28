const express = require('express');
const router = express.Router();

const{
    //cartPage,
    viewCart,
    addToCart,
    deleteFromCart,
    addItemQuantity,
    removeItemQuantity,
    notLoggedIn
} = require('../controllers/cartController');

// GET requests
//router.get('/',cartPage);
router.get('/:id/mycart',viewCart);
router.get('/auth',notLoggedIn);

// POST requests
router.post('/:id/add',addToCart);
router.post('/:id/mycart/delete',deleteFromCart);
router.post('/:id/mycart/incr',addItemQuantity);
router.post('/:id/mycart/remove',removeItemQuantity);

module.exports = router;