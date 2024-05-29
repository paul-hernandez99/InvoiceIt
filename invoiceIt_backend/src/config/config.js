require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.MONGO_URL,
    openAIKey: process.env.OPENAIKEY
};

