// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.get('/user/:userId', productController.getProductsByUser);
router.get('/user/:userId/code/:codeId', productController.getProductsByUserAndCode);

module.exports = router;
