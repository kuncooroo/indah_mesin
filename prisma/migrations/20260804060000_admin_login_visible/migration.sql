-- Toggle visibility of /admin/login from dashboard
ALTER TABLE `SiteSetting` ADD COLUMN `adminLoginVisible` BOOLEAN NOT NULL DEFAULT true;
