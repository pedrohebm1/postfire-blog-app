-- DropForeignKey
ALTER TABLE "Commentary" DROP CONSTRAINT "Commentary_author_id_fkey";

-- CreateTable
CREATE TABLE "_UserLikesCommentaries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserLikesCommentaries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserLikesCommentaries_B_index" ON "_UserLikesCommentaries"("B");

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikesCommentaries" ADD CONSTRAINT "_UserLikesCommentaries_A_fkey" FOREIGN KEY ("A") REFERENCES "Commentary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikesCommentaries" ADD CONSTRAINT "_UserLikesCommentaries_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
