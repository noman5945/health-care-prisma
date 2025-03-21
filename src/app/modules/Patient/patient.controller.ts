import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { patientFilterableFields } from "./patient.constants";
import { PatientService } from "./patient.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllPatients = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const filters = utilFunctions.pickFilters(
      req.body,
      patientFilterableFields
    );
    const pagination = utilFunctions.pickFilters(req.body, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await PatientService.getAllPatients(filters, pagination);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PatientsController = {
  getAllPatients,
};
