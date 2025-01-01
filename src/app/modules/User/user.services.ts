import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const createAdminService = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.password,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transClient) => {
    const createUserData = await transClient.user.create({
      data: userData,
    });
    const createAdminData = await transClient.admin.create({
      data: data.admin,
    });
    return createAdminData;
  });
  return result;
};

export const userServices = {
  createAdminService,
};
