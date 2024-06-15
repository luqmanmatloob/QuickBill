// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const secret = 'your_jwt_secret_key'; // Use a strong, unique key

// const protect = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, secret);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             res.status(401).send('Not authorized, token failed');
//         }
//     }
//     if (!token) {
//         res.status(401).send('Not authorized, no token');
//     }
// };

// module.exports = { protect };
