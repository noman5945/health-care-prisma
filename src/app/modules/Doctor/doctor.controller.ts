import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { doctorFilterableFields } from "./doctor.constants";

const getAllDoctors = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    console.log(req.query);
    const filters = utilFunctions.pickFilters(
      req.query,
      doctorFilterableFields
    );
    const pagination = utilFunctions.pickFilters(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await doctorServices.getAllDoctors(filters, pagination);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor data fetched successfully",
      data: result,
    });
  }
);

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

const deleteDoctorData = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const result = await doctorServices.deleteDoctor(doctorId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor data deleted successfully",
      data: result,
    });
  }
);

const softDeleteDoctorData = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const result = await doctorServices.softDeleteDoctor(doctorId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor status updated to deleted successfully",
      data: result,
    });
  }
);

export const doctorControllers = {
  updateDoctorData,
  getAllDoctors,
  deleteDoctorData,
  softDeleteDoctorData,
};
