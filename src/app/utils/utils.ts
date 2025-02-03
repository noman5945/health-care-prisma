import bcrypt from "bcrypt";

async function encryptPassword(plainTextPass: string) {
  return await bcrypt.hash(plainTextPass, 12);
}

/**
 *
 * @param obj An Object containing fillters given by client
 * @param keys filters that are desired
 * @returns Filters that are needed for certain query
 */
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
