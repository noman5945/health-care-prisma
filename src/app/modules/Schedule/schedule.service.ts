import { PrismaClient } from "@prisma/client";
import { addDays, addHours, addMinutes, format } from "date-fns";

const prisma = new PrismaClient();
const createNewScheduleIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const interval = 30;
  const schedules = [];

  //for each given date create slots
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );
    const endDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interval),
      };
      schedules.push(scheduleData);
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  const result = await prisma.schedule.createManyAndReturn({ data: schedules });

  return result;
};

export const ScheduleService = {
  createNewScheduleIntoDB,
};
