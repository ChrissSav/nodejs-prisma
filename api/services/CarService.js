const { PrismaClient } = require('@prisma/client');
const { ConflictError } = require('../errors/ValidationErrors');
const { car } = new PrismaClient();

const registerCar = async (brandId, model, plate, userId) => {
  const carExists = await car.findUnique({
    where: {
      plate,
    },
    select: {
      plate: true,
    },
  });

  if (carExists) {
    throw new ConflictError('car already exists');
  }

  return await car.create({
    data: {
      brandId,
      model,
      plate,
      userId,
    },
    select: { id: true, brand: true, model: true, plate: true },
  });
};

const getCarsByUserId = async (userId) => {
  const cars = await car.findMany({
    where: {
      userId,
    },
  });

  return cars;
};

exports.registerCar = registerCar;
exports.getCarsByUserId = getCarsByUserId;
