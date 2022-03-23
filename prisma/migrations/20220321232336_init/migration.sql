/*
  Warnings:

  - Added the required column `title` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "title" TEXT NOT NULL;
