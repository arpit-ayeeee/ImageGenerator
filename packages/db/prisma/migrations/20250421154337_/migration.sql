/*
  Warnings:

  - A unique constraint covering the columns `[falAiReqId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[falAiReqId]` on the table `OutputImages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Model_falAiReqId_key" ON "Model"("falAiReqId");

-- CreateIndex
CREATE UNIQUE INDEX "OutputImages_falAiReqId_key" ON "OutputImages"("falAiReqId");
