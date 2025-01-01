import bcrypt from "bcrypt";

async function encryptPassword(plainTextPass: string) {
  return await bcrypt.hash(plainTextPass, 12);
}

export const utilFunctions = {
  encryptPassword,
};
