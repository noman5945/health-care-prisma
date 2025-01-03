import bcrypt from "bcrypt";

async function encryptPassword(plainTextPass: string) {
  return await bcrypt.hash(plainTextPass, 12);
}

function pickFilters<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
}

export const utilFunctions = {
  encryptPassword,
  pickFilters,
};
