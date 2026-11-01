-- Link Google sign-in to a stable subject, and revoke storefront JWTs
-- when a password is replaced or Google adopts an existing account.

ALTER TABLE `User`
    ADD COLUMN `googleSub` VARCHAR(191) NULL,
    ADD COLUMN `authVersion` INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX `User_googleSub_key` ON `User`(`googleSub`);
