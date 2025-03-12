import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { specialtyServices } from "./specialties.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createNewSpecialty = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const iconfile = req.file;
    const newData = req.body.data;
    const result = await specialtyServices.createNewSpecialty(
      newData,
      iconfile
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New category of Specialty created",
      data: result,
    });
  }
);

export const specialtyControllers = {
  createNewSpecialty,
};
