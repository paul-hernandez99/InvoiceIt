const User = require('../models/User');

exports.addUser = async (email, name, surname, birthday) => {
    user = new User({ email, name, surname, birthday});
    await user.save();
    return { status: 201, body: { message: 'User created successfully', user } };
  
};

exports.findAllUsers = async () => {
  return await User.find();
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email: email });
};