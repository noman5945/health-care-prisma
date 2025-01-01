import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllAdmins = async () => {
  const query = {};
  const result = await prisma.admin.findMany(query);
  return result;
};

export const adminServices = {
  getAllAdmins,
};
