const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const constans = require('../utils/constans');
const { registerUser, loginUser } = require('../services/UserService');

router.post('/signup', [check('username').isEmail(), check('password').isLength({ min: 4 })], async (req, res) => {
  const { username, password } = req.body;

  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      errros: errros.array(),
    });
  }

  try {
    const newUser = await registerUser(username, password);
    res.setHeader(constans.JWT_HEADER, newUser.accessToken);
    res.status(201).send(newUser.user);
  } catch (error) {
    return res.status(error.statusCode).json({
      msg: error.msg,
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await loginUser(username, password);
    res.setHeader(constans.JWT_HEADER, newUser.accessToken);
    res.status(200).send(newUser.user);
  } catch (error) {
    return res.status(error.statusCode).json({
      msg: error.msg,
    });
  }
});

module.exports = router;
