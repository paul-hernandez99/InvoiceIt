// invoiceService.js
const Invoice = require('../models/Invoice');

async function createInvoice(userId, products, totalAmount) {
    try {
        const invoice = new Invoice({
            user: userId,
            products,
            totalAmount
        });
        const savedInvoice = await invoice.save();
        return { status: 201, body: savedInvoice };
    } catch (error) {
        throw error;
    }
}

async function findAllInvoices() {
    try {
        const invoices = await Invoice.find();
        return invoices;
    } catch (error) {
        throw error;
    }
}

async function findInvoiceById(invoiceId) {
    try {
        const invoice = await Invoice.findById(invoiceId);
        return invoice;
    } catch (error) {
        throw error;
    }
}

async function findInvoicesByUser(userId) {
    try {
        const invoices = await Invoice.find({ user: userId });
        return invoices;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createInvoice,
    findAllInvoices,
    findInvoiceById,
    findInvoicesByUser
};
