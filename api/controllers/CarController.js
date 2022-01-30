const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { registerCar, getCarsByUserId } = require('../services/CarService');
const { car } = new PrismaClient();

router.get('/', async (req, res) => {
  const cars = await getCarsByUserId(req.currentUserId);

  res.send(cars);
});

router.post('/', async (req, res) => {
  const { brandId, model, plate } = req.body;

  const newCar = await registerCar(brandId, model, plate, req.currentUserId);

  res.send(newCar);
});

module.exports = router;
