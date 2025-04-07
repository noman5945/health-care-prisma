import bcrypt from "bcrypt";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

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

/**
 * A higher order function to abstract away and prevent repeatetion of try catch
 * @param fn A request handler type function with request and response arguments
 * @returns An async function
 */
function handleRequestTryCatch(fn: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
}

/**
 * convert date into readable format
 * @param date
 * @returns
 */
const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

export const utilFunctions = {
  encryptPassword,
  pickFilters,
  handleRequestTryCatch,
  convertDateTime,
};
