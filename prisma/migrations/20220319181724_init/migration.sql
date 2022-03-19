-- AlterTable
ALTER TABLE "DoctorHour" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Hour" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
