import { Prisma, PrismaClient, Schedule } from "@prisma/client";
import { addDays, addHours, addMinutes, format } from "date-fns";
import { ISchedule } from "./schedule.interface";
import { utilFunctions } from "../../utils/utils";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
import { IAuthUser } from "../Auth/auth.interface";

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

const getAllSchedules = async (
  filters: any,
  pagination: IOptions,
  user: IAuthUser
) => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((keys) => ({
        [keys]: {
          equals: (filterData as any)[keys],
        },
      })),
    });
  }
  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: { doctor: { email: user?.email } },
  });
  const scheduleIds = doctorSchedules.map((shedule) => {
    return shedule.scheduleId;
  });
  //console.log(scheduleIds);
  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      pagination.sortBy && pagination.sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
      },
    },
  });
  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

export const ScheduleService = {
  createNewScheduleIntoDB,
  getAllSchedules,
};
