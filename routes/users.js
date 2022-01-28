const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();

router.get('/', async (req, res) => {
  let users = await user.findMany({
    select: {
      id: true,
      username: true,
      cars: {
        select: {
          id: true,
          brand: true,
          model: true,
          plate: true,
        },
      },
    },
  });

  res.send(users);
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

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

  let newUser = await user.create({
    data: {
      username,
      password,
    },
    select: {
      username: true,
      id: true,
    },
  });

  res.send(newUser);
});

module.exports = router;
