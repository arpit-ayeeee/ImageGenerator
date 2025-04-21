/*
  Warnings:

  - The `status` column on the `OutputImages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('Pending', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "OutputImgStatus" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "falAiReqId" TEXT,
ADD COLUMN     "status" "ModelStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "triggerWord" TEXT;

-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "falAiReqId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "OutputImgStatus" NOT NULL DEFAULT 'Pending';

-- DropEnum
DROP TYPE "Status";
