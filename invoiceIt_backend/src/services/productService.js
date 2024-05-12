// productService.js
const Product = require('../models/Product');
const User = require('../models/User');

exports.addProduct = async (code_id, item_name, price_per_unit, quantity, discount, buyerEmail) => {
    try {
        // Find the user by email to get their ObjectId
        const user = await User.findOne({ email: buyerEmail });

        // If user is not found, return an error
        if (!user) {
            return { status: 404, body: { error: 'User not found' } };
        }

        // Create the product with the correct ObjectId for the buyer field
        const product = new Product({
            code_id,
            item_name,
            price_per_unit,
            quantity,
            discount,
            buyer: user._id // Assuming user._id is the ObjectId of the buyer
        });

        // Save the product to the database
        await product.save();

        return { status: 201, body: product };
    } catch (error) {
        // Handle any errors
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

exports.findProductsByUser = async (userId) =>  {
    try {
        const products = await Product.find({ buyer: userId });
        return products;
    } catch (error) {
        throw error;
    }
};

exports.findProductsByUserAndCode = async (userId, codeId) =>  {
    try {
        const products = await Product.find({ buyer: userId, code_id: codeId });
        return products;
    } catch (error) {
        throw error;
    }
};

