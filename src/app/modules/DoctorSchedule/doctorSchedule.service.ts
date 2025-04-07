import { Prisma, PrismaClient } from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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
      //appointmentId: "1234",
    };
  });

  const result = await prisma.doctorSchedules.createMany({
    data: doctorscheduleData,
  });
  return result;
};

const getMySchedule = async (
  user: IAuthUser,
  filter: any,
  paginationOptions: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const { startDate, endDate, ...filterOptions } = filter;
  const andOptions = [];
  if (startDate && endDate) {
    andOptions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterOptions).length > 0) {
    if (
      typeof filterOptions.isBooked === "string" &&
      filterOptions.isBooked === "true"
    ) {
      filterOptions.isBooked = true;
    } else if (
      typeof filterOptions.isBooked === "string" &&
      filterOptions.isBooked === "false"
    ) {
      filterOptions.isBooked = false;
    }

    andOptions.push({
      AND: Object.keys(filterOptions).map((option) => {
        return {
          [option]: {
            equals: (filterOptions as any)[option],
          },
        };
      }),
    });
  }

  const whereOption: Prisma.DoctorSchedulesWhereInput =
    andOptions.length > 0 ? { AND: andOptions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereOption,
    skip,
    take: limit,
    //orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : {}, "createdAt causes problem pass anything here like startDate or anything"
  });

  const total = await prisma.doctorSchedules.count({
    where: whereOption,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteDoctorSchedule = async (user: IAuthUser, scheduleId: string) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const checkisBooked = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorInfo.id,
        scheduleId: scheduleId,
      },
      isBooked: true,
    },
  });

  if (checkisBooked) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "You can not delete the schedule because of the schedule is already booked!"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: { doctorId: doctorInfo.id, scheduleId: scheduleId },
    },
  });

  return result;
};

export const DoctorScheduleService = {
  createNewDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
