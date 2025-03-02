import { NextFunction, Request, Response } from "express";
import { AuthUtils } from "../utils/authUtils";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const authorise = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorised access! No token found."
        );
      }
      const decoded = AuthUtils.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      console.log(decoded);
      if (role.length && !role.includes(decoded.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You are not Authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorise;
