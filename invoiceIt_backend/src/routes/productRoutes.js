const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route for adding a product
router.post('/', productController.addProduct);

// Route for getting all products of a user
router.get('/:userId', productController.getAllProductsOfUser);

// Route for getting products by code_id of a user
router.get('/:userId/:code_id', productController.getProductsByCodeId);

module.exports = router;
