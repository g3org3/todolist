-- DropForeignKey
ALTER TABLE `ChecklistItem` DROP FOREIGN KEY `ChecklistItem_todoId_fkey`;

-- AddForeignKey
ALTER TABLE `ChecklistItem` ADD CONSTRAINT `ChecklistItem_todoId_fkey` FOREIGN KEY (`todoId`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
