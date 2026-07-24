-- AlterTable User (profil)
ALTER TABLE `User` ADD COLUMN `avatarUrl` TEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `companyName` VARCHAR(191) NULL,
    ADD COLUMN `buyerCode` VARCHAR(191) NULL,
    ADD COLUMN `verifiedBuyer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'id',
    ADD COLUMN `companyAddress` TEXT NULL;

CREATE UNIQUE INDEX `User_buyerCode_key` ON `User`(`buyerCode`);

-- CreateTable Category
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `group` ENUM('MARKETPLACE', 'FILTER', 'BERANDA') NOT NULL DEFAULT 'MARKETPLACE',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Product: categorySlug + categoryId + status enum
ALTER TABLE `Product` ADD COLUMN `categorySlug` VARCHAR(191) NULL,
    ADD COLUMN `categoryId` VARCHAR(191) NULL;

UPDATE `Product` SET `categorySlug` = `category`;

ALTER TABLE `Product` MODIFY `categorySlug` VARCHAR(191) NOT NULL;

ALTER TABLE `Product` ADD COLUMN `status_enum` ENUM('READY', 'INDENT', 'CONTACT') NOT NULL DEFAULT 'READY';

UPDATE `Product` SET `status_enum` = CASE
    WHEN LOWER(`status`) = 'indent' THEN 'INDENT'
    WHEN LOWER(`status`) = 'contact' THEN 'CONTACT'
    ELSE 'READY'
END;

ALTER TABLE `Product` DROP COLUMN `status`;
ALTER TABLE `Product` CHANGE `status_enum` `status` ENUM('READY', 'INDENT', 'CONTACT') NOT NULL DEFAULT 'READY';

ALTER TABLE `Product` DROP COLUMN `category`;

CREATE INDEX `Product_categorySlug_idx` ON `Product`(`categorySlug`);
CREATE INDEX `Product_published_idx` ON `Product`(`published`);

ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable ProductDocument
CREATE TABLE `ProductDocument` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NOT NULL DEFAULT 'description',
    `fileUrl` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable Article
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `body` LONGTEXT NULL,
    `imageUrl` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `readMinutes` INTEGER NOT NULL DEFAULT 5,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Article_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable Favorite
CREATE TABLE `Favorite` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Favorite_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable PurchaseOrder
CREATE TABLE `PurchaseOrder` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'WHATSAPP_SENT') NOT NULL DEFAULT 'DRAFT',
    `picName` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `companyAddress` TEXT NULL,
    `voltage` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `estimatedPrice` VARCHAR(191) NULL,
    `whatsappMessage` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable PurchaseOrderItem
CREATE TABLE `PurchaseOrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `purchaseOrderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `priceLabel` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable SiteSetting
CREATE TABLE `SiteSetting` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `brandName` VARCHAR(191) NOT NULL,
    `phoneDisplay` VARCHAR(191) NOT NULL,
    `phoneTel` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `salesEmail` VARCHAR(191) NOT NULL,
    `showroomHeroImage` TEXT NULL,
    `mapImageUrl` TEXT NULL,
    `hoursWeekdayLabel` VARCHAR(191) NULL,
    `hoursWeekdayValue` VARCHAR(191) NULL,
    `hoursSaturdayLabel` VARCHAR(191) NULL,
    `hoursSaturdayValue` VARCHAR(191) NULL,
    `hoursSundayLabel` VARCHAR(191) NULL,
    `hoursSundayValue` VARCHAR(191) NULL,
    `headOfficeTitle` VARCHAR(191) NULL,
    `headOfficeLines` JSON NULL,
    `showroomTitle` VARCHAR(191) NULL,
    `showroomLines` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable QuickFilter
CREATE TABLE `QuickFilter` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `QuickFilter_label_key`(`label`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductDocument` ADD CONSTRAINT `ProductDocument_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
