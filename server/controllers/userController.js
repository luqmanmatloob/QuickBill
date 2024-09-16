
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');

let secretKey = 'process.env.SECRET_KEY'; 



async function getJwtSecretKeyAppend() {
  try {
    const user = await User.findOne().exec();
    if (user) {
      return user.jwtSecretKeyAppend;
    } else {
      return null; // Return null if no user is found
    }
  } catch (error) {
    console.error('Error fetching jwtSecretKeyAppend:', error);
    throw error; // Rethrow error to be handled by the caller
  }
}




// Controller function to handle login /old
// exports.login = async (req, res) => {

//   (async () => {
//     let jwtSecretKeyAppend = await getJwtSecretKeyAppend();
//     if (jwtSecretKeyAppend) {
//       secretKey = `${process.env.SECRET_KEY}${jwtSecretKeyAppend}`;
//     }
//   })();
  
//   const { username, password } = req.body;

//   try {
//     // Check if any user document exists in the database
//     const existingUser = await User.findOne({});

//     if (!existingUser) {
//       // No user exists, create a new default user
//       const newUser = new User({ username: 'admin', password: '123' });
//       await newUser.save();
//       return res.status(201).json({ message: 'Default user created. Please login again.' });
//     }

//     // Find the user by the provided username
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Verify the password
//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '28d' });
//     console.log(`secret key login controller ${secretKey}`)

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch secret key append before the rest of the logic
    const jwtSecretKeyAppend = await getJwtSecretKeyAppend();
    const secretKey = `${process.env.SECRET_KEY}${jwtSecretKeyAppend || ''}`;

    // Check if any user document exists in the database
    const existingUser = await User.findOne({});

    if (!existingUser) {
      // No user exists, create a new default user
      const newUser = new User({ username: 'admin', password: '123' });
      await newUser.save();
      return res.status(201).json({ message: 'Default user created. Please login again.' });
    }

    // Find the user by the provided username
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '28d' });
    console.log(`Secret key in login controller: ${secretKey}`);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};





// Controller function to change username
exports.changeUsername = async (req, res) => {
  const { newUsername, secretKey } = req.body;

  try {
    // Find the user by the provided secret key
    const user = await User.findOne({ secretKey });

    if (!user) {
      return res.status(401).json({ message: 'Invalid secret key' });
    }

    // Update username
    user.username = newUsername;
    await user.save();

    res.json({ message: 'Username changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to change password
exports.changePassword = async (req, res) => {
  const { newPassword, secretKey } = req.body;

  try {
    // Find the user by the provided secret key
    const user = await User.findOne({ secretKey });

    if (!user) {
      return res.status(401).json({ message: 'Invalid secret key' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to change secret key
exports.changeSecretKey = async (req, res) => {
  const { oldSecretKey, newSecretKey } = req.body;

  try {
    // Find the user by the provided old secret key
    const user = await User.findOne({ secretKey: oldSecretKey });

    if (!user) {
      return res.status(401).json({ message: 'Invalid old secret key' });
    }

    // Update secret key
    user.secretKey = newSecretKey;
    await user.save();

    res.json({ message: 'Secret key changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};





// controllers/userController.js

exports.checkvalidity = async (req, res) => {
  try {
    // Check if the user is authenticated
    // For example, you might want to verify the token or check the user's session
    if (req.user) {  // Assuming `req.user` is set by your auth middleware
      return res.status(200).json({ valid: true });
    }
    
    return res.status(401).json({ valid: false });
  } catch (error) {
    console.error('Error checking validity:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller finction for loggoing out from all devices by incrementing "jwtSecretKeyAppend" field in user collection which is appended with the secret key

exports.logoutalldevices = async (req, res) => {
  try {
    // Find a user to get the current jwtSecretKeyAppend value
    const user = await User.findOne().exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment jwtSecretKeyAppend value
    user.jwtSecretKeyAppend += 1;
    await user.save();

    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Error logging out from all devices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

