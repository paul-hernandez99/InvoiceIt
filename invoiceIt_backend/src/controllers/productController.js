// productController.js
const productService = require('../services/productService');

exports.createProduct = async (req, res, next) => {
    try {
        const { code_id, item_name, price_per_unit, quantity, discount, buyer } = req.body;
        const product = await productService.addProduct(code_id, item_name, price_per_unit, quantity, discount, buyer);
        res.status(product.status).json(product.body);
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.findAllProducts();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await productService.findProductById(productId);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getProductsByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const products = await productService.findProductsByUser(userId);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductsByUserAndCode = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const codeId = req.params.codeId;
        const products = await productService.findProductsByUserAndCode(userId, codeId);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
