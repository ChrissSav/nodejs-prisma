require('dotenv').config();

const jwt = require('jsonwebtoken');
const constans = require('../utils/constans');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  if (req.url.startsWith('/api/auth')) {
    next();
    return;
  }

  const token = req.header(constans.JWT_HEADER);
  // CHECK IF WE EVEN HAVE A TOKEN

  if (!token) {
    res.status(401).json({
      msg: 'No token found',
    });
    return;
  }

  try {
    const user = await jwt.verify(token, JWT_SECRET);
    req.currentUserId = user.id;
    next();
  } catch (error) {
    res.status(400).json({
      msg: 'Invalid Token',
    });
    return;
  }
};
