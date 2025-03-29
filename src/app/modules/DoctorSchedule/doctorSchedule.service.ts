import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createNewDoctorSchedule = async (
  user: any,
  payload: { scheduleIds: string[] }
) => {
  const existingDoctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: user.email },
  });
  const doctorscheduleData = payload.scheduleIds.map((schedule) => {
    return {
      doctorId: existingDoctor.id,
      scheduleId: schedule,
      isBooked: false,
      appointmentId: "1234",
    };
  });

  const result = await prisma.doctorSchedules.createMany({
    data: doctorscheduleData,
  });
  return result;
};

export const DoctorScheduleService = {
  createNewDoctorSchedule,
};
