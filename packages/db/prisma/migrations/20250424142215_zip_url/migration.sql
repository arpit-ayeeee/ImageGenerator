/*
  Warnings:

  - You are about to drop the `TrainingImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainingImages" DROP CONSTRAINT "TrainingImages_modelId_fkey";

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "zipUrl" TEXT;

-- DropTable
DROP TABLE "TrainingImages";
