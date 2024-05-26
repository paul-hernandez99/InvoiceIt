// Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    code_id: { type: String, required: true },
    item_name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    price_per_unit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    transactionType: { type: String, enum: ['buy', 'sell'], required: true }, // New field
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
