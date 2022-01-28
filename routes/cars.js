const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { car, user } = new PrismaClient();

router.get('/', async (req, res) => {
  let cars = await car.findMany({
    select: {
      id: true,
      brand: true,
      model: true,
      plate: true,
    },
  });

  res.send(cars);
});

router.post('/', async (req, res) => {
  const { brand, model, plate, userId } = req.body;

  const carExists = await car.findUnique({
    where: {
      plate,
    },
    select: {
      plate: true,
    },
  });

  if (carExists) {
    return res.status(400).json({
      msg: 'car already exists',
    });
  }

  let newCar = await car.create({
    data: {
      brand,
      model,
      plate,
      userId,
    },
  });

  res.send(newCar);
});

module.exports = router;
