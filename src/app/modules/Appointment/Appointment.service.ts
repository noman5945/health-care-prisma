import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { utilFunctions } from "../../utils/utils";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
const prisma = new PrismaClient();
const createNewAppointment = async (user: IAuthUser, payload: any) => {
  const patientId = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: payload.doctorId },
  });
  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId = utilFunctions.generateUniqueId();
  const status = AppointmentStatus.SCHEDULED;
  const paymentStatus = PaymentStatus.UNPAID;
  const newData = {
    patientId: patientId.id,
    ...payload,
    videoCallingId,
    status,
    paymentStatus,
  };
  const result = await prisma.$transaction(async (tx) => {
    const newAppointment = await tx.appointment.create({ data: newData });
    const doctorAppointment = await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: newAppointment.id,
      },
    });

    const today = new Date();
    const transactionID =
      "healthcare-" + today.getFullYear() + "-" + today.getMonth();
    const payment = await tx.payment.create({
      data: {
        appointmentId: newAppointment.id,
        amount: doctor.appointmentFee,
        transactionId: transactionID,
        status: PaymentStatus.UNPAID,
        paymentGatewayData: JSON.stringify({}),
      },
    });
    return newAppointment;
  });
  return result;
};

const getMyAppointments = async (
  user: IAuthUser,
  filters: any,
  pagination: IOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(pagination);
  const { ...filterData } = filters;
  console.log(filterData, user, pagination);
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  if (user.role === UserRole.PATIENT) {
    andConditions.push({ patient: { email: user?.email } });
  } else if (user.role === UserRole.DOCTOR) {
    andConditions.push({ doctor: { email: user?.email } });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((filter) => ({
      [filter]: {
        equals: (filterData as any)[filter],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      pagination.sortBy && pagination.sortOrder
        ? { [pagination.sortBy]: pagination.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { MedicalReport: true, PatientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
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

export const AppointmentServices = {
  createNewAppointment,
  getMyAppointments,
};
