require('dotenv').config();

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const constans = require('../utils/constans');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', [check('username').isEmail(), check('password').isLength({ min: 4 })], async (req, res) => {
  const { username, password } = req.body;

  const errros = validationResult(req);

  if (!errros.isEmpty()) {
    return res.status(400).json({
      errros: errros.array(),
    });
  }

  const userExists = await user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  if (userExists) {
    return res.status(400).json({
      msg: 'user already exists',
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser = await user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      username: true,
      id: true,
    },
  });

  const accessToken = await generateAccessToken(newUser.id);

  res.setHeader(constans.JWT_HEADER, accessToken);
  res.status(201).send(newUser);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userExists = await user.findUnique({
    where: {
      username,
    },
  });

  if (!userExists) {
    return res.status(422).json({
      msg: 'Invalid Credentials',
    });
  }

  // Check if the password is valid
  let isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    return res.status(404).json({
      msg: 'Invalid Credentials',
    });
  }

  const accessToken = await generateAccessToken(userExists.id);

  res.setHeader(constans.JWT_HEADER, accessToken);
  res.send({
    id: userExists.id,
    username: userExists.username,
  });
});

const generateAccessToken = async (id) => {
  return await JWT.sign({ id }, JWT_SECRET, {
    expiresIn: 360000,
  });
};

module.exports = router;
