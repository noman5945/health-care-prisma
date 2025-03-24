import { Prisma, PrismaClient } from "@prisma/client";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
import { patientSearchableFields } from "./patient.constants";

const prisma = new PrismaClient();
const getAllPatients = async (filters: any, paginationOptions: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      MedicalReport: true,
      PatientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getPatientByID = async (id: string) => {
  const result = await prisma.patient.findUniqueOrThrow({
    where: { id: id, isDeleted: false },
  });
  return result;
};

const deletePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: { id: id, isDeleted: false },
  });
  const result = await prisma.$transaction(async (transClient) => {
    const patientDelete = await transClient.patient.delete({
      where: { id: id },
    });
    const userDelete = await transClient.user.delete({
      where: { email: patientDelete.email },
    });

    return patientDelete;
  });
  return result;
};

const softDeletePatient = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({ where: { id, isDeleted: false } });
  const result = await prisma.patient.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const updatePatientData = async (id: string, updateData: any) => {
  const { patientHealthData, medicalReport, ...patientData } = updateData;
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: { id: id, isDeleted: false },
  });
  await prisma.$transaction(async (transClient) => {
    await transClient.patient.update({
      where: { id: id },
      data: patientData,
      include: {
        PatientHealthData: true,
        MedicalReport: true,
      },
    });
    if (patientHealthData) {
      await transClient.patientHealthData.upsert({
        where: { patientId: patientInfo.id },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    if (medicalReport) {
      await transClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });
  const result = await prisma.patient.findUniqueOrThrow({
    where: { id: patientInfo.id, isDeleted: false },
    include: {
      PatientHealthData: true,
      MedicalReport: true,
    },
  });
  return result;
};

export const PatientService = {
  getAllPatients,
  getPatientByID,
  updatePatientData,
  deletePatient,
  softDeletePatient,
};
