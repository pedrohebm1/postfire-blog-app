/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Commentary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commentary" DROP COLUMN "isDeleted",
ADD COLUMN     "isDeletedContent" BOOLEAN NOT NULL DEFAULT false;
