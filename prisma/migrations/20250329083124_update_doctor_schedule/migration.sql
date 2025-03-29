-- DropForeignKey
ALTER TABLE "DoctorSchedules" DROP CONSTRAINT "DoctorSchedules_appointmentId_fkey";

-- AlterTable
ALTER TABLE "DoctorSchedules" ALTER COLUMN "appointmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DoctorSchedules" ADD CONSTRAINT "DoctorSchedules_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
