/*
  Warnings:

  - The `changeLog` column on the `addresses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `changeLog` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "changeLog",
ADD COLUMN     "changeLog" JSONB;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "changeLog",
ADD COLUMN     "changeLog" JSONB;
