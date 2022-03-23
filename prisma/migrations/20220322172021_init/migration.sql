/*
  Warnings:

  - A unique constraint covering the columns `[day,start]` on the table `Hour` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hour_day_start_key" ON "Hour"("day", "start");
