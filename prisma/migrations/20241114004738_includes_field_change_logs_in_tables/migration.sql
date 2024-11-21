/*
  Warnings:

  - Added the required column `changeLog` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changeLog` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "changeLog" VARCHAR(4096) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "changeLog" VARCHAR(4096) NOT NULL;
