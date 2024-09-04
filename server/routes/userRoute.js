// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for logging in
router.post('/login', userController.login);

// Protected route for changing password
router.put('/change-password', authMiddleware, userController.changePassword);


module.exports = router;
