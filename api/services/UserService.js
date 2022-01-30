const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT = require('jsonwebtoken');
const { NotFoundError, ConflictError } = require('../errors/ValidationErrors');

const registerUser = async (username, password) => {
  const userExists = await user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  if (userExists) {
    throw new NotFoundError('user already exists');
  }

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

  return {
    accessToken,
    user: newUser,
  };
};

const loginUser = async (username, password) => {
  const userExists = await user.findUnique({
    where: {
      username,
    },
  });

  if (!userExists) {
    throw new ConflictError('Invalid Credentials');
  }

  // Check if the password is valid
  let isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    throw new NotFoundError('Invalid Credentials');
  }

  const accessToken = await generateAccessToken(userExists.id);

  return {
    accessToken,
    user: {
      id: userExists.id,
      username: userExists.username,
    },
  };
};

const generateAccessToken = async (id) => {
  return await JWT.sign({ id }, JWT_SECRET, {
    expiresIn: 360000,
  });
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
