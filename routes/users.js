const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();

router.get('/', async (req, res) => {
  let users = await user.findUnique({
    where: { id: req.currentUserId },
    select: {
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

module.exports = router;
