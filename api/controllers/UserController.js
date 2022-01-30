const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('../services/UserService');

router.get('/', async (req, res) => {
  const user = await findUserById(req.currentUserId);

  res.send(user);
});

module.exports = router;
