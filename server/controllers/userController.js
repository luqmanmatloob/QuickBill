const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Login



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid username or password' });
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid username or password' });
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
        
        // Set the JWT as a cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only send the cookie over HTTPS in production
            maxAge: 3600000 // 1 hour
        });

        // Send user ID along with a success message
        res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
