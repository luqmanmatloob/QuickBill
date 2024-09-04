
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const secretKey = '234234234'; // Replace with your secret key

// Controller function to handle login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: 'admin' });

    if (!user) {
      // If no user exists, create a default one
      const newUser = new User({ username: 'admin', password: '123' });
      await newUser.save();
      return res.status(201).json({ message: 'Default user created. Please login again.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller function to change password
exports.changePassword = async (req, res) => {
    const { passChangeQuestion1, passChangeQuestion2, passChangeKey1, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ username: 'admin' });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Validate security questions and key
      if (
        user.passChangeQuestion1 !== passChangeQuestion1 ||
        user.passChangeQuestion2 !== passChangeQuestion2 ||
        user.passChangeKey1 !== passChangeKey1
      ) {
        return res.status(401).json({ message: 'Security answers or key are incorrect' });
      }
  
      // Update password
      user.password = newPassword;
      await user.save();
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  exports.changeSecurityQuestions = async (req, res) => {
    const { oldQuestion1, oldQuestion2, oldKey, newQuestion1, newQuestion2, newKey } = req.body;
  
    try {
      const user = await User.findOne({ username: 'admin' });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Validate old security questions and key
      if (
        user.passChangeQuestion1 !== oldQuestion1 ||
        user.passChangeQuestion2 !== oldQuestion2 ||
        user.passChangeKey1 !== oldKey
      ) {
        return res.status(401).json({ message: 'Old security answers or key are incorrect' });
      }
  
      // Update security questions and key
      user.passChangeQuestion1 = newQuestion1;
      user.passChangeQuestion2 = newQuestion2;
      user.passChangeKey1 = newKey;
      await user.save();
  
      res.json({ message: 'Security questions updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  