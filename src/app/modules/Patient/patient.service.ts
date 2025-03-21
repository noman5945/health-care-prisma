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

const getPatientByID = async () => {};

const updatePatientData = (id: string, updateData: any) => {};

export const PatientService = {
  getAllPatients,
  getPatientByID,
  updatePatientData,
};
