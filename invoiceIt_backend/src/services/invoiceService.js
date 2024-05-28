// invoiceService.js
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Product = require('../models/Product');

exports.createInvoice = async (userId, products, totalAmount, date) => { // Added date parameter
    try {
        const user = await User.findOne({ email: userId });
        
        if (!user) {
            return { status: 404, body: { error: 'User not found' } };
        }

        const productObjectIds = await Promise.all(products.map(async (code_id) => {
            const product = await Product.findOne({ code_id }); // Find product by code_id
            if (product) {
                return product._id; // Return the ObjectId of the found product
            } else {
                return null; // Or handle the case where the product is not found
            }
        }));

        const validProductObjectIds = productObjectIds.filter(id => id !== null);
        const invoice = new Invoice({
            user: user._id,
            products: validProductObjectIds, // Use the ObjectId array
            totalAmount,
            date // Include the date
        });

        const savedInvoice = await invoice.save();
        return { status: 201, body: savedInvoice };
    } catch (error) {
        throw error;
    }
};

exports.findAllInvoices = async () => {
    try {
        const invoices = await Invoice.find()
        .populate('products');
        return invoices;
    } catch (error) {
        throw error;
    }
};

exports.findInvoiceById = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        return invoice;
    } catch (error) {
        throw error;
    }
};

exports.findInvoicesByUser = async (userId) => {
    try {
        const user = await User.findOne({ email: userId });
        const invoices = await Invoice.find({ user: user._id });
        return invoices;
    } catch (error) {
        throw error;
    }
};

