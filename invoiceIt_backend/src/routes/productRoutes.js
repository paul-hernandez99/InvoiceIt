const express = require('express');
const router = express.Router();
const {addProduct, getAllProductsOfUser, getProductsByCodeId, addGet} = require('../controllers/productController');

// Route for adding a product
router.get('/product', addGet);
//router.post('/product', addProduct);

// Route for getting all products of a user
router.get('/products/:userId', getAllProductsOfUser);

// Route for getting products by code_id of a user
router.get('/products/:userId/:code_id', getProductsByCodeId);

module.exports = router;
