import e, { Request, Response } from "express";
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

const getNewAccessToken = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthServices.getNewaccessToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Access token retrived successfully",
      data: result,
    });
  }
);

const changePassword = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const result = await AuthServices.changePassword(
      user,
      oldPassword,
      newPassword
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const forgotPassword = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const result = await AuthServices.forgotPassword({ email: email });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New token for password reset",
      data: result,
    });
  }
);

const resetPassword = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";
    const payload = {
      id: req.body.id,
      newPassword: req.body.newPass,
    };
    const result = await AuthServices.resetPassword(token as string, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset successfull",
      data: result,
    });
  }
);

export const AuthController = {
  loginUser,
  getNewAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
