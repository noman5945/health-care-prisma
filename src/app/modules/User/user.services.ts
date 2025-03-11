import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { utilFunctions } from "../../utils/utils";
import uploadImage from "../../utils/imageUpload";
import { IOptions } from "../Admin/admin.interface";
import { paginationHelper } from "../../utils/calculatePagination";
import { ICurrentUserInfo, IUserFilter } from "./user.interface";
import { userSearchAbleFields } from "./user.constants";
import { JwtPayload } from "jsonwebtoken";
import { GenericRepository } from "../../repository/generic.repository";

const prisma = new PrismaClient();
const createAdminService = async (incomingUserData: any, file: any) => {
  const data = JSON.parse(incomingUserData);

  if (file) {
    const uploadResult = await uploadImage(file);
    data.admin.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword: string = await utilFunctions.encryptPassword(
    data.password
  );
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.SUPER_ADMIN,
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

const createDoctorService = async (incomingUserData: any, file: any) => {
  const data = JSON.parse(incomingUserData);
  if (file) {
    const uploadResult = await uploadImage(file);
    data.doctor.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword: string = await utilFunctions.encryptPassword(
    data.password
  );
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (transClient) => {
    const createUserData = await transClient.user.create({
      data: userData,
    });
    const createDoctorData = await transClient.doctor.create({
      data: data.doctor,
    });
    return createDoctorData;
  });
  return result;
};

const createPatientService = async (incomingUserData: any, file: any) => {
  const data = JSON.parse(incomingUserData);

  if (file) {
    const uploadResult = await uploadImage(file);
    data.patient.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword: string = await utilFunctions.encryptPassword(
    data.password
  );
  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (transClient) => {
    const createUserData = await transClient.user.create({
      data: userData,
    });
    const createPatientData = await transClient.patient.create({
      data: data.patient,
    });
    return createPatientData;
  });
  return result;
};

const getAllUsers = async (params: any, options: IOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfile = async (user: JwtPayload) => {
  const table = user.role.toLowerCase();
  const genericRepo = new GenericRepository(table);
  const profile = await genericRepo.readProfileExternal(user.email, table);
  const userInfo = await genericRepo.readProfileExternal(user.email, "user");
  return { profile, userInfo };
};

export const userServices = {
  createAdminService,
  createDoctorService,
  createPatientService,
  getAllUsers,
  getMyProfile,
};
