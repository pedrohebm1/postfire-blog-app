/*
  Warnings:

  - You are about to drop the column `userPicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "allowCommentaries" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPicture",
ADD COLUMN     "socialGithub" TEXT,
ADD COLUMN     "socialInstagram" TEXT,
ADD COLUMN     "socialTwitter" TEXT,
ADD COLUMN     "socialWebsite" TEXT;
