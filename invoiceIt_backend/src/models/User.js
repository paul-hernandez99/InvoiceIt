const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String},
  surname: { type: String},
  birthday: { type: String},
  // Define other fields as needed
});

const User = mongoose.model('User', userSchema);
module.exports = User;
