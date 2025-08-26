-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `sku` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `images` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `weight` DECIMAL(8, 2) NULL,
    `dimensions` JSON NULL,
    `tags` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `status` ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
    `total` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_escuela_alumno` (
    `id_escuela_alumno` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `app` VARCHAR(50) NOT NULL,
    `apm` VARCHAR(50) NOT NULL,
    `curp` VARCHAR(18) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `id_localidad` INTEGER NOT NULL,
    `codigo_postal` INTEGER NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `primaria_promedio_1` DECIMAL(5, 1) NULL,
    `primaria_promedio_2` DECIMAL(5, 1) NULL,
    `primaria_promedio_general` DECIMAL(5, 1) NULL,
    `primaria_promedio_general_letra` VARCHAR(50) NULL,
    `secundaria_promedio_1` DECIMAL(5, 1) NULL,
    `secundaria_promedio_2` DECIMAL(5, 1) NULL,
    `secundaria_promedio_3` DECIMAL(5, 1) NULL,
    `secundaria_promedio_general` DECIMAL(5, 1) NULL,
    `secundaria_promedio_general_letra` VARCHAR(50) NULL,
    `primaria_folio_certificado` VARCHAR(50) NULL,
    `secundaria_folio_certificado` VARCHAR(50) NULL,
    `vigente` ENUM('S', 'N') NOT NULL DEFAULT 'S',
    `fecha_in` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dt_escuela_alumno_curp_key`(`curp`),
    PRIMARY KEY (`id_escuela_alumno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_escuela_alumno_grado` (
    `id_escuela_alumno_grado` INTEGER NOT NULL AUTO_INCREMENT,
    `id_escuela_alumno` INTEGER NOT NULL,
    `id_escuela_plantel` INTEGER NOT NULL,
    `id_escuela_ciclo_escolar` INTEGER NOT NULL,
    `nivel` INTEGER NOT NULL,
    `grado` INTEGER NOT NULL,
    `intento` INTEGER NOT NULL,
    `id_escuela_alumno_estatus` INTEGER NOT NULL,
    `id_escuela_alumno_estatus_grado` INTEGER NOT NULL,
    `fecha_in` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_at` DATETIME(3) NULL,

    PRIMARY KEY (`id_escuela_alumno_grado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_escuela_alumno_grado` ADD CONSTRAINT `rl_escuela_alumno_grado_id_escuela_alumno_fkey` FOREIGN KEY (`id_escuela_alumno`) REFERENCES `dt_escuela_alumno`(`id_escuela_alumno`) ON DELETE RESTRICT ON UPDATE CASCADE;
