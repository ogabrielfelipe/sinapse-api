/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "document" VARCHAR(14) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schools_document_key" ON "schools"("document");
