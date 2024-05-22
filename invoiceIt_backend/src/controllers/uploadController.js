const uploadService = require('../services/uploadService');

exports.uploadPdf = async (req, res) => {
  try {
    const filePath = req.file.path;
    const extractedData = await uploadService.processPdf(filePath);
    await uploadService.updateDatabase(extractedData);
    res.status(200).send('File uploaded and processed successfully');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  }
};