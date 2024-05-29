const uploadService = require('../services/uploadService');

exports.uploadPdf = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const user_email = JSON.parse(req.body.user).email;
    const extractedData = await uploadService.processPdf(filePath);
    const invoice = await uploadService.updateDatabase(extractedData, user_email);
    res.status(invoice.status).json(invoice.body);
  } catch (error) {
    next(error);
  }
};