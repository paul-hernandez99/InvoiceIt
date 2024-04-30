require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config/config')

const app = express();
const PORT = config.port;

app.use(cors());
app.use(bodyParser.json());

// DB CONNECTION
mongoose.connect(config.databaseUrl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ROUTES
app.use('/', userRoutes);

// ERROR HANDLING
app.use(errorHandler);

// SERVER RUNNING
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


