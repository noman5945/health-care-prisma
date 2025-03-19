import { Prisma, PrismaClient } from "@prisma/client";
import { IDoctorFilters, IDoctorUpdate } from "./doctor.interface";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
import { doctorSearchableFields } from "./doctor.constants";

const prisma = new PrismaClient();

const getAllDoctors = async (
  filters: IDoctorFilters,
  paginationOptions: IOptions
) => {
  const andCondition: Prisma.DoctorWhereInput[] = [];
  const { searchTerm, specialties, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const searchFields = doctorSearchableFields;
  if (searchTerm) {
    andCondition.push({
      OR: searchFields.map((key) => ({
        [key]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andCondition.push({
      DoctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andCondition.push(...filterConditions);
  }
  andCondition.push({
    isDeleted: false,
  });

  const whereCondition: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: { DoctorSpecialties: { include: { specialties: true } } },
  });

  const total = await prisma.doctor.count({
    where: whereCondition,
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

const deleteDoctor = async (doctorID: string) => {
  const result = await prisma.$transaction(async (transClient) => {
    const deleteDoctor = await transClient.doctor.delete({
      where: { id: doctorID },
    });

    const deleteUser = await transClient.user.delete({
      where: { email: deleteDoctor.email },
    });

    return deleteDoctor;
  });

  return result;
};

const softDeleteDoctor = async (doctorID: string) => {
  const result = await prisma.$transaction(async (transClient) => {
    const updateDeleteStatusDoc = await transClient.doctor.update({
      where: { id: doctorID },
      data: { isDeleted: true },
    });
    const updateDeleteStatusUser = await transClient.user.update({
      where: { email: updateDeleteStatusDoc.email },
      data: { status: "DELETED" },
    });

    return updateDeleteStatusDoc;
  });
  return result;
};

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
  getAllDoctors,
  deleteDoctor,
  softDeleteDoctor,
};
