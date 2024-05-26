// invoiceController.js
const invoiceService = require('../services/invoiceService');

exports.createInvoice = async (req, res, next) => {
    try {
        const { user, products, totalAmount, invoiceType } = req.body;
        const invoice = await invoiceService.createInvoice(user, products, totalAmount, invoiceType);
        res.status(invoice.status).json(invoice.body);
    } catch (error) {
        next(error);
    }
};

exports.getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await invoiceService.findAllInvoices();
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId;
        const invoice = await invoiceService.findInvoiceById(invoiceId);
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

exports.getInvoicesByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const invoices = await invoiceService.findInvoicesByUser(userId);
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};
