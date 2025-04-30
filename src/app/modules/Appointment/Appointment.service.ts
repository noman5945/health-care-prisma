import { AppointmentStatus, PaymentStatus, PrismaClient } from "@prisma/client";
import { IAuthUser } from "../Auth/auth.interface";
import { utilFunctions } from "../../utils/utils";
const prisma = new PrismaClient();
const createNewAppointment = async (user: IAuthUser, payload: any) => {
  const patientId = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });
  await prisma.doctor.findUniqueOrThrow({
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
  const result = await prisma.appointment.create({ data: newData });
  return result;
};

export const AppointmentServices = {
  createNewAppointment,
};
