const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, createUser } = require('../controllers/userController');

router.post('/user', createUser);
router.get('/users/:email', getUser);
router.get('/users', getAllUsers);

module.exports = router;
