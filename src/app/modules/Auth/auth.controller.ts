import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { utilFunctions } from "../../utils/utils";
import { AuthServices } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const loginUser = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, {
      secure: false,
      httpOnly: true,
    });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logged in successfully",
      data: result,
    });
  }
);

export const AuthController = {
  loginUser,
};
