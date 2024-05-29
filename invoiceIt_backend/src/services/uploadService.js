const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execFile } = require('child_process');
const config = require('../config/config');
const productService = require('../services/productService');
const invoiceService = require('../services/invoiceService');

exports.processPdf = async (filePath) => {
  try {
      const base64Image = await pdfToImageBase64(filePath);

      if (base64Image) {
        const response = await callOpenAIWithBase64Image(base64Image);
        if (response) {
          const messageContent = response.choices[0].message.content;
          return JSON.parse(messageContent);

        } else {
            console.log('Failed to get response from OpenAI.');
        }

        fs.unlink(filePath, (err) => {
          if (err) {
              console.log('Failed to delete the PDF file:', err);
          } else {
              console.log('PDF file deleted successfully.');
          }
        });
        
      } else {
          console.log('Conversion to base64 failed.');
      }
      
  } catch (error) {
      console.log('Error processing PDF:', error);
  }
};

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
  const fullYear = year < 100 ? 2000 + year : year; // Assuming 21st century
  return new Date(fullYear, month - 1, day); // Month is zero-based in JavaScript Date
}

exports.updateDatabase = async (extractedData, user_email) => {

  const invoice_date = extractedData.invoice_date;
  const items = extractedData.items;
  let total_amount = parseFloat(extractedData.total_amount);

  if (total_amount == NaN) {
    total_amount = 0;
  }
    
  invoice_date_parsed = parseDate(invoice_date);

  let products = [];

  try {

    for (let i = 0; i < items.length; i++) {
      products.push(items[i].code);
      const code_id = items[i].code;
      const item_name = items[i].item_name;

      let price_per_unit = parseFloat(items[i].price_per_unit);
      let quantity = parseFloat(items[i].quantity);
      let discount = parseFloat(items[i].discount);

      if (price_per_unit == NaN) {
        price_per_unit = 0;
      } else if (quantity == NaN) {
        quantity = 0;
      } else if (discount == NaN) {
        discount = 0;
      }
    
      const product = await productService.addProduct(code_id, item_name, invoice_date_parsed, price_per_unit, quantity, discount, user_email);

    }

    return await invoiceService.createInvoice(user_email, products, total_amount, invoice_date);
  } catch (error) {
    console.log(error.message);
  }
  
}

function pdfToImageBase64(pdfPath) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'pdf_to_base64.py');
        const process = execFile('python3', [scriptPath, pdfPath], (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${stderr}`);
            }

            try {
                const result = JSON.parse(stdout);
                if (result.error) {
                    return reject(result.error);
                }
                resolve(result.image_base64);
            } catch (e) {
                reject(`Failed to parse response: ${e.message}`);
            }
        });
    });
}

async function callOpenAIWithBase64Image(imageBase64) {

  const apiKey = config.openAIKey;

  const headers = {

    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`

  };

  const payload = {

    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract the code, item name, price per unit, quantity and discount of the items in the invoice, and the date and the total amount of the invoice, return it in a json format. Only return the json, do not return any other text. You have to use the following keys for the json: {invoice_date: , total_amount: ,items: [{code: ,item_name: ,price_per_unit: ,quantity: ,discount: ,import: },...]}'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],

    max_tokens: 300

  };

  try {

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    return response.data;

  } catch (error) {

    console.error('Error:', error.response ? error.response.data : error.message);
    return null;

  }
}
  
