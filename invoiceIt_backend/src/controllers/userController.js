const userService = require('../services/userService');

exports.createUser = async (req, res, next) => {
    try {
        const { email, name, surname, birthday } = req.body;
        const user = await userService.addUser(email, name, surname, birthday);
        res.status(user.status).json(user.body);
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const email = req.params.email;
        const user = await userService.findUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
