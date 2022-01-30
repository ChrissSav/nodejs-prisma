const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();

const findUserById = async (id) => {
  const userCurent = await user.findUnique({
    where: { id: id },
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
  return userCurent;
};

exports.findUserById = findUserById;
