// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('./models/user'); // Make sure the path is correct

// const router = express.Router();
// const JWT_SECRET = '983745987435783947'; // Use a secure secret in production

// // Register route (Only needed once to create the initial user)
// router.post('/register', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const userExists = await User.findOne({ username });
//         if (userExists) {
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         const user = new User({ username, password });
//         await user.save();
//         res.status(201).json({ message: 'User registered' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Login route
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = await User.findOne({ username });
//         if (!user || !(await user.matchPassword(password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Change password route
// router.post('/change-password', async (req, res) => {
//     const { username, oldPassword, newPassword } = req.body;
//     try {
//         const user = await User.findOne({ username });
//         if (!user || !(await user.matchPassword(oldPassword))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         user.password = newPassword;
//         await user.save();
//         res.json({ message: 'Password changed' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;
