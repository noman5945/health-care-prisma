import { PrismaClient, Schedule } from "@prisma/client";
import { addDays, addHours, addMinutes, format } from "date-fns";
import { ISchedule } from "./schedule.interface";
import { utilFunctions } from "../../utils/utils";

const prisma = new PrismaClient();
const createNewScheduleIntoDB = async (
  payload: ISchedule
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30;
  const schedules = [];
  const existingDateTimeSet = new Set<string>();

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const existingDateTime = await prisma.schedule.findMany({
    where: {
      startDateTime: {
        gte: new Date(currentDate),
        lte: new Date(addDays(lastDate, 1)),
      },
    },
  });

  existingDateTime.forEach((schedule) => {
    existingDateTimeSet.add(
      `${schedule.startDateTime}-${schedule.endDateTime}`
    );
  });

  console.log(existingDateTimeSet);

  //for each given date create slots
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const s = await utilFunctions.convertDateTime(startDateTime);
      const e = await utilFunctions.convertDateTime(
        addMinutes(startDateTime, interval)
      );
      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };
      const testscheduleData = {
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(addMinutes(startDateTime, interval)),
      };
      //console.log(scheduleData);
      const key = `${testscheduleData.startDateTime}-${testscheduleData.endDateTime}`;
      if (!existingDateTimeSet.has(key)) {
        schedules.push(testscheduleData);
      }

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
