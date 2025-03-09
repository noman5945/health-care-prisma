import { Request, Response } from "express";
import { userServices } from "./user.services";
import { utilFunctions } from "../../utils/utils";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdminService(
      req.body.data,
      req.file
    );
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const createDoctor = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const result = await userServices.createDoctorService(
      req.body.data,
      req.file
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor Created Successfully",
      data: result,
    });
  }
);

const createPatient = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const result = await userServices.createPatientService(
      req.body.data,
      req.file
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Pateint Created Successfully",
      data: result,
    });
  }
);

const getAllUsers = async () => {};

export const userController = {
  createAdmin,
  getAllUsers,
  createDoctor,
  createPatient,
};
