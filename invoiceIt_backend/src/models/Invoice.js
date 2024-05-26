// Invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  totalAmount: { type: Number, required: true },
  invoiceType: { type: String, enum: ['buy', 'sell'], required: true }, // New field
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
