import { Admin, Prisma, PrismaClient } from "@prisma/client";
import { searchQueryType } from "../../types/queryTypes";
import { paginationHelper } from "../../utils/calculatePagination";

const prisma = new PrismaClient();
const getAllAdmins = async (params: any, pagination: any) => {
  //console.log(params);
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { limit, sortOrder, sortBy, skip } =
    paginationHelper.calculatePagination(pagination);
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
    skip: skip,
    take: limit,
    orderBy:
      pagination.sortBy && pagination.sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({ where: whereConditions });
  return {
    meta: {
      limit,
      page: Number(pagination.page),
      total,
    },
    data: result,
  };
};

const getAdminByID = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAdminByID = async (id: string, data: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id: id,
    },
    data,
  });
};

const deleteAdminByID = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const deleteAdminProfile = await transactionClient.admin.delete({
      where: { id },
    });

    const deleteUser = await transactionClient.user.delete({
      where: { email: deleteAdminProfile.email },
    });
    return deleteAdminProfile;
  });

  return result;
};

export const adminServices = {
  getAllAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID,
};
