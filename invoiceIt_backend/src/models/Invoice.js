// Invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    totalAmount: { type: Number, required: true },
    date: { type: Date, required: true }, // New field for invoice date
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
