import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { patientFilterableFields } from "./patient.constants";
import { PatientService } from "./patient.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllPatients = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const filters = utilFunctions.pickFilters(
      req.query,
      patientFilterableFields
    );
    const pagination = utilFunctions.pickFilters(req.query, [
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

const getPatientByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PatientService.getPatientByID(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient retrieval successfully",
      data: result,
    });
  }
);

const deletePatient = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PatientService.deletePatient(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient deletion successful",
      data: result,
    });
  }
);

const softDeletePatient = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PatientService.softDeletePatient(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient deletion successful",
      data: result,
    });
  }
);

const updatePatientData = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const result = await PatientService.updatePatientData(id, data);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Patient update successful",
      data: result,
    });
  }
);
export const PatientsController = {
  getAllPatients,
  getPatientByID,
  deletePatient,
  softDeletePatient,
  updatePatientData,
};
