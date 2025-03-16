import { PrismaClient } from "@prisma/client";
import { IDoctorUpdate } from "./doctor.interface";

const prisma = new PrismaClient();
const updateDoctorData = async (doctorid: string, payload: IDoctorUpdate) => {
  const { specialties, ...doctorData } = payload;
  const docInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorid },
  });
  await prisma.$transaction(async (transClient) => {
    await transClient.doctor.update({
      where: { id: doctorid },
      data: doctorData,
    });
    if (specialties && specialties.length > 0) {
      const deletedSpecialty = specialties.filter(
        (speciality) => speciality.isDeleted
      );
      for (const specialty of deletedSpecialty) {
        await transClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: docInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
      const createSpecialty = specialties.filter(
        (speciality) => !speciality.isDeleted
      );
      for (const specialty of createSpecialty) {
        await transClient.doctorSpecialties.create({
          data: {
            doctorId: docInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUniqueOrThrow({
    where: { id: docInfo.id },
    include: { DoctorSpecialties: { include: { specialties: true } } },
  });
  return result;
};

export const doctorServices = {
  updateDoctorData,
};
