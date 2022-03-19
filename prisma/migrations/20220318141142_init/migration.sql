/*
  Warnings:

  - You are about to drop the column `patientId` on the `DoctorHour` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorHour" DROP CONSTRAINT "DoctorHour_patientId_fkey";

-- AlterTable
ALTER TABLE "DoctorHour" DROP COLUMN "patientId";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "hourId" INTEGER NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hourId_fkey" FOREIGN KEY ("hourId") REFERENCES "DoctorHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
