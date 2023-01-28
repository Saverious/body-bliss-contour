const express = require('express');
const router = express.Router();

const{ 
    adminHome,
    adminProducts,
    adminOrders,
    adminCarts,
    customers,
    cartDetail,
    orderDetail,
    customerDetail,
    addItemForm,
    addProduct,
    deleteProduct,
    editProduct,
    updateProduct
 } = require('../controllers/adminController');

// GET requests
router.get('/',adminHome);
router.get('/products',adminProducts);
router.get('/orders',adminOrders);
router.get('/carts',adminCarts);
router.get('/customers',customers);
router.get('/cart/:id',cartDetail);
router.get('/order/:id',orderDetail);
router.get('/customer/:id',customerDetail);
router.get('/add/product',addItemForm);
router.get('/:id/edit',editProduct);

// POST requests
router.post('/add/item',addProduct);
router.post('/:id/delete',deleteProduct);
router.post('/:id/update',updateProduct);

module.exports = router;