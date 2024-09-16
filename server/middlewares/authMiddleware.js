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
    throw error; 
  }
}


// old login 
// module.exports = (req, res, next) => {

//   // Update the secret key with appended value

//   (async () => {
//     let jwtSecretKeyAppend = await getJwtSecretKeyAppend();
//     if (jwtSecretKeyAppend) {
//       secretKey = `${process.env.SECRET_KEY}${jwtSecretKeyAppend}`;
//     }
//   })();
  

//   // Use `req.headers` instead of `req.header` for consistent behavior
//   const authorizationHeader = req.headers['authorization'];

//   if (!authorizationHeader) {
//     return res.status(401).json({ message: 'Access denied, no token provided' });
//   }

//   // Split the header value and check the format
//   const token = authorizationHeader.replace('Bearer ', '');


//   if (!token) {
//     return res.status(401).json({ message: 'Access denied, invalid token format' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     console.log(`secret key auth function  ${secretKey}`)

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };




module.exports = async (req, res, next) => {
  try {
    const jwtSecretKeyAppend = await getJwtSecretKeyAppend();
    const secretKey = `${process.env.SECRET_KEY}${jwtSecretKeyAppend || ''}`;

    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied, invalid token format' });
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log(`Secret key in auth function: ${secretKey}`);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
