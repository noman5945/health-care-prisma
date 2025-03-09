import { PrismaClient, UserRole } from "@prisma/client";
import { utilFunctions } from "../../utils/utils";
import uploadImage from "../../utils/imageUpload";

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

export const userServices = {
  createAdminService,
  createDoctorService,
  createPatientService,
};
