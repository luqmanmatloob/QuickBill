const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = 'process.env.SECRET_KEY'; 

module.exports = (req, res, next) => {
  // Use `req.headers` instead of `req.header` for consistent behavior
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  // Split the header value and check the format
  const token = authorizationHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied, invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
