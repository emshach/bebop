/*
  Warnings:

  - Added the required column `admin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT E'string',
    "label" TEXT NOT NULL,
    "help" TEXT,
    "value" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);
