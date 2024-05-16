// productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProduct, getProductsByUser, getProductsByUserAndCode } = require('../controllers/productController');

router.post('/product', createProduct);
router.get('/products', getAllProducts);
router.get('/products/user/:userId', getProductsByUser);
router.get('/products/user/:userId/code/:codeId', getProductsByUserAndCode);
router.get('/products/:productId', getProduct);

module.exports = router;
