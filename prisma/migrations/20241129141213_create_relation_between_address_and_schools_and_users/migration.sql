/*
  Warnings:

  - You are about to drop the column `changeLog` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `changeLog` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "changeLog",
DROP COLUMN "user_id",
ADD COLUMN     "change_log" JSONB;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "changeLog",
ADD COLUMN     "address_id" VARCHAR(30),
ADD COLUMN     "change_log" JSONB;

-- CreateTable
CREATE TABLE "schools" (
    "id" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "address_id" VARCHAR(30),
    "change_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
