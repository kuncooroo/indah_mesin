-- CreateEnum
ALTER TABLE `Order` ADD COLUMN `estimatedDays` INTEGER NULL,
    ADD COLUMN `estimatedEndDate` DATETIME(3) NULL,
    ADD COLUMN `progressPercent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `wbsTemplateId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `WbsTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `estimatedDays` INTEGER NOT NULL DEFAULT 30,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WbsTemplateItem` (
    `id` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `estimatedHours` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WbsTemplateItem_templateId_idx`(`templateId`),
    INDEX `WbsTemplateItem_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderProgressTask` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `weightPercent` DECIMAL(5, 2) NOT NULL,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    `estimatedDays` INTEGER NULL,
    `estimatedHours` INTEGER NULL,
    `actualHours` INTEGER NULL,
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrderProgressTask_orderId_idx`(`orderId`),
    INDEX `OrderProgressTask_parentId_idx`(`parentId`),
    INDEX `OrderProgressTask_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderProgressPhoto` (
    `id` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `caption` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderProgressPhoto_taskId_idx`(`taskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserNotification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `linkUrl` TEXT NULL,
    `orderId` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserNotification_userId_readAt_idx`(`userId`, `readAt`),
    INDEX `UserNotification_orderId_idx`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_wbsTemplateId_fkey` FOREIGN KEY (`wbsTemplateId`) REFERENCES `WbsTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `WbsTemplateItem` ADD CONSTRAINT `WbsTemplateItem_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `WbsTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `WbsTemplateItem` ADD CONSTRAINT `WbsTemplateItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `WbsTemplateItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `OrderProgressTask` ADD CONSTRAINT `OrderProgressTask_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `OrderProgressTask` ADD CONSTRAINT `OrderProgressTask_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `OrderProgressTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `OrderProgressPhoto` ADD CONSTRAINT `OrderProgressPhoto_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `OrderProgressTask`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `UserNotification` ADD CONSTRAINT `UserNotification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX `Order_wbsTemplateId_idx` ON `Order`(`wbsTemplateId`);
