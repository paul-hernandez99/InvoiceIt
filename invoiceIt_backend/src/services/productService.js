// productService.js
const Product = require('../models/Product');
const User = require('../models/User');

exports.addProduct = async (code_id, item_name, date, price_per_unit, quantity, discount, buyerEmail) => {
    try {
        const user = await User.findOne({ email: buyerEmail });

        if (!user) {
            return { status: 404, body: { error: 'User not found' } };
        }

        const product = new Product({
            code_id,
            item_name,
            date,
            price_per_unit,
            quantity,
            discount,
            buyer: user._id
        });

        await product.save();

        return { status: 201, body: product };
    } catch (error) {
        console.error(error);
        return { status: 500, body: { error: 'Internal Server Error' } };
    }
};

exports.findAllProducts = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw error;
    }
};

exports.findProductById = async (productId) =>  {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw error;
    }
};

exports.findProductsByUser = async (userEmail) => {
    try {
        // Find the user by email to get their ObjectId
        const user = await User.findOne({ email: userEmail });

        // If user is not found, return an empty array or handle the case accordingly
        if (!user) {
            return [];
        }

        // Use the user's ObjectId to find the products
        const products = await Product.find({ buyer: user._id });
        return products;
    } catch (error) {
        throw error;
    }
};
exports.findProductsByUserAndCode = async (userId, codeId) =>  {
    try {
        const user = await User.findOne({ email: userId });

        const products = await Product.find({ buyer: user._id, code_id: codeId });
        return products;
    } catch (error) {
        throw error;
    }
};

