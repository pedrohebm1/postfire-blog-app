/*
  Warnings:

  - You are about to drop the column `bannerImage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bannerImage",
ADD COLUMN     "userPicture" TEXT;
