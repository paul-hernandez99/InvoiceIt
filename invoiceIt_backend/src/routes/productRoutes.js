// productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProduct, getProductsByUser, getProductsByUserAndCode } = require('../controllers/productController');

router.post('/product', createProduct);
router.get('/product', getAllProducts);
router.get('/user/:userId', getProductsByUser);
router.get('/user/:userId/code/:codeId', getProductsByUserAndCode);
router.get('/:productId', getProduct);

module.exports = router;
