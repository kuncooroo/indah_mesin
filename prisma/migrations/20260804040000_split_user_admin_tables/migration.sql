-- Split storefront User and panel Admin into separate tables.

CREATE TABLE IF NOT EXISTS `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` TEXT NULL,
    `role` ENUM('ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Admin_username_key`(`username`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    INDEX `Admin_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `Admin` (`id`, `username`, `name`, `email`, `password`, `avatar`, `role`, `createdAt`, `updatedAt`)
SELECT `id`, `username`, `name`, `email`, `password`, `avatar`,
  CASE WHEN `role` = 'SUPERADMIN' THEN 'SUPERADMIN' ELSE 'ADMIN' END,
  `createdAt`, `updatedAt`
FROM `User`
WHERE `role` IN ('ADMIN', 'SUPERADMIN')
ON DUPLICATE KEY UPDATE
  `username` = VALUES(`username`),
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `avatar` = VALUES(`avatar`),
  `role` = VALUES(`role`),
  `updatedAt` = VALUES(`updatedAt`);

DELETE FROM `User` WHERE `role` IN ('ADMIN', 'SUPERADMIN');

ALTER TABLE `User` DROP COLUMN `role`;
