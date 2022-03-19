/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- CreateTable
CREATE TABLE "Hour" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,

    CONSTRAINT "Hour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorHour" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hourId" INTEGER NOT NULL,
    "patientId" TEXT,

    CONSTRAINT "DoctorHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorHour_doctorId_hourId_key" ON "DoctorHour"("doctorId", "hourId");

-- AddForeignKey
ALTER TABLE "DoctorHour" ADD CONSTRAINT "DoctorHour_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHour" ADD CONSTRAINT "DoctorHour_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHour" ADD CONSTRAINT "DoctorHour_hourId_fkey" FOREIGN KEY ("hourId") REFERENCES "Hour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
