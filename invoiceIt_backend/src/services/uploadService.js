const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execFile } = require('child_process');

exports.processPdf = async (filePath) => {
  try {
      const base64Image = await pdfToImageBase64(filePath);

      if (base64Image) {
        const response = await callOpenAIWithBase64Image(base64Image);
        if (response) {
          const messageContent = response.choices[0].message.content;
          console.log('Response from OpenAI:', messageContent);
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

exports.updateDatabase = async (extractedData) => {
    // Implement logic to update the database with extracted data
    // Example: Update users, invoices, and products collections
    console.log("updateDatabase");
  };
  
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

    const apiKey = 'some gpt api key';
  
    const headers = {

      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`

    };
  
    const payload = {

      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the code, item name, price per unit, quantity and discount of the items in the invoice, return it in a json format. Only return the json, do not return any other text.'
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
  
