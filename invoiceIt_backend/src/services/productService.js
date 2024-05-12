// productService.js
const Product = require('../models/Product');

async function addProduct(code_id, item_name, price_per_unit, quantity, discount, buyer) {
    try {
        const product = new Product({
            code_id,
            item_name,
            price_per_unit,
            quantity,
            discount,
            buyer
        });
        const savedProduct = await product.save();
        return { status: 201, body: savedProduct };
    } catch (error) {
        throw error;
    }
}

async function findAllProducts() {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw error;
    }
}

async function findProductById(productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw error;
    }
}

async function findProductsByUser(userId) {
    try {
        const products = await Product.find({ buyer: userId });
        return products;
    } catch (error) {
        throw error;
    }
}

async function findProductsByUserAndCode(userId, codeId) {
    try {
        const products = await Product.find({ buyer: userId, code_id: codeId });
        return products;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addProduct,
    findAllProducts,
    findProductById,
    findProductsByUser,
    findProductsByUserAndCode
};
