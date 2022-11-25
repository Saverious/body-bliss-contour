const express = require('express');
const router = express.Router();

const{
    adminPage,
    createProduct,
    getProduct,
    updateProductGET,
    updateProductPost,
    deleteProduct
 } = require('../controllers/adminController');

// get requests
router.get('/product',adminPage);
router.get('/product/create',getProduct);
router.get('/product/:id/delete',deleteProduct);
router.get('/product/:id/update',updateProductGET);

// post requests
router.post('/product/create',createProduct);
router.post('/product/:id/update',updateProductPost);

module.exports = router;