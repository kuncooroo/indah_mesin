-- Split storefront users from admin roles.
-- BUYER / PURCHASING / APPROVER → USER
-- ADMIN / SUPERADMIN remain admin panel roles.

ALTER TABLE `User` MODIFY `role` VARCHAR(32) NOT NULL DEFAULT 'USER';

UPDATE `User` SET `role` = 'USER' WHERE `role` IN ('BUYER', 'PURCHASING', 'APPROVER');

ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'USER';
