// // controllers/userController.js
// const User = require('../../models/User');

// exports.changePassword = async (req, res) => {
//     const { username, currentPassword, newPassword } = req.body;

//     try {
//         // Find the user
//         const user = await User.findOne({ username });

//         // Check if the current password matches
//         if (user.password !== currentPassword) {
//             return res.status(400).json({ error: 'Current password is incorrect' });
//         }

//         // Update the password
//         user.password = newPassword;
//         await user.save();

//         res.status(200).json({ message: 'Password changed successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
