require('dotenv').config();

const jwt = require('jsonwebtoken');
const { checkUserById } = require('../services/AuthService');
const constans = require('../utils/constans');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  if (req.url.startsWith('/api/auth')) {
    next();
    return;
  }

  const token = req.header(constans.JWT_HEADER);

  if (!token) {
    res.status(401).json({
      msg: 'No token found',
    });
    return;
  }

  try {
    /*
     * Check if user's token is valid and user exist in db
     */
    const verifyUser = await jwt.verify(token, JWT_SECRET);

    /*
     * Check if user exist in db
     */
    const user = await checkUserById(verifyUser.id);

    if (user == null) {
      res.status(401).json({
        msg: 'User not valid',
      });
      return;
    }

    req.currentUserId = user.id;
    next();
  } catch (error) {
    res.status(400).json({
      msg: 'Invalid Token',
    });
    return;
  }
};
