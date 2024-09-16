const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for logging in
router.post('/login', userController.login);

// Protected route for changing username
router.put('/change-username', authMiddleware, userController.changeUsername);

// Protected route for changing password
router.put('/change-password', authMiddleware, userController.changePassword);

// Protected route for changing secret key
router.put('/change-secretkey', authMiddleware, userController.changeSecretKey);

// Protected route for checking token validity for front end so route them on login page
router.put('/checkvalidity', authMiddleware, userController.checkvalidity);

// Protected route for loggoing out from all devices by incrementing "jwtSecretKeyAppend" field in user collection which is appended with the secret key
router.put('/logoutalldevices', authMiddleware, userController.logoutalldevices);

module.exports = router;
