const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();
const bcrypt = require('bcrypt');
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
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
  const refreshToken = await generateRefreshToken(newUser.id);

  return {
    accessToken,
    refreshToken,
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
  const refreshToken = await generateRefreshToken(userExists.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: userExists.id,
      username: userExists.username,
    },
  };
};

const refreshUserToken = async (token) => {
  const verifyUser = await JWT.verify(token, JWT_REFRESH_SECRET);
  const accessToken = await generateAccessToken(verifyUser.id);
  const refreshToken = await generateRefreshToken(verifyUser.id);

  return {
    accessToken,
    refreshToken,
  };
};

const checkUserById = async (id) => {
  return await user.findUnique({
    where: { id: id },
    select: {
      id: true,
    },
  });
};

const generateAccessToken = async (id) => {
  return await JWT.sign({ id }, JWT_ACCESS_SECRET, {
    expiresIn: 600, // 10 minutes
  });
};

const generateRefreshToken = async (id) => {
  return await JWT.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: 172800, // 2 days
  });
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.checkUserById = checkUserById;
exports.refreshUserToken = refreshUserToken;
