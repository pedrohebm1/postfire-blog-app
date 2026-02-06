-- AlterTable
ALTER TABLE "Commentary" ADD COLUMN     "parentCommentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Commentary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
