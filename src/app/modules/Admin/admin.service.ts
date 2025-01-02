import { Prisma, PrismaClient } from "@prisma/client";
import { searchQueryType } from "../../types/queryTypes";

const prisma = new PrismaClient();
const getAllAdmins = async (params: any) => {
  //console.log(params);
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const searchFields = ["name", "email"];
  if (params.searchTerm) {
    andConditions.push({
      OR: searchFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }
  //console.dir(andConditions, { depth: "infinity" });
  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
};
