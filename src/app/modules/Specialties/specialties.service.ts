import { PrismaClient } from "@prisma/client";
import { GenericRepository } from "../../repository/generic.repository";
import uploadImage from "../../utils/imageUpload";

const prisma = new PrismaClient();
const createNewSpecialty = async (newData: any, iconfile: any) => {
  const data = JSON.parse(newData);
  if (iconfile) {
    const uploadResult = await uploadImage(iconfile);
    data.specialty.icon = uploadResult?.secure_url;
  }
  console.log(data.specialty);
  const newSpecialty = await prisma.specialties.create(data.specialty);
  return newSpecialty;
};

export const specialtyServices = {
  createNewSpecialty,
};
