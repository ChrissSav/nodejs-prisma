-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(255) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `plate` VARCHAR(10) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Car_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
