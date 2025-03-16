import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const updateDoctorData = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await doctorServices.updateDoctorData(id, updatedData);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor data updated successfully",
      data: result,
    });
  }
);

export const doctorControllers = {
  updateDoctorData,
};
