require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    databaseUrl: 'mongodb://localhost:27017/invoiceit'
};

