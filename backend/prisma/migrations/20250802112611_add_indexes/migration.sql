-- CreateIndex
CREATE INDEX "Bookmarks_userId_idx" ON "Bookmarks"("userId");

-- CreateIndex
CREATE INDEX "Comment_projectId_createdAt_idx" ON "Comment"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "CommentVote_commentId_voteType_idx" ON "CommentVote"("commentId", "voteType");

-- CreateIndex
CREATE INDEX "Project_difficulty_domain_idx" ON "Project"("difficulty", "domain");

-- CreateIndex
CREATE INDEX "Project_domain_idx" ON "Project"("domain");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");
