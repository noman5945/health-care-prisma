import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import { utilFunctions } from "../../utils/utils";
import { paginationOptions, queryOptions } from "./admin.constants";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllAdmins = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = utilFunctions.pickFilters(req.query, queryOptions);
    const pagination = utilFunctions.pickFilters(req.query, paginationOptions);

    const result = await adminServices.getAllAdmins(query, pagination);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Admins fetched Successfully ",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAdminByID: RequestHandler = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminServices.getAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Admins fetched Successfully ",
      data: result,
    });
  }
);

const updateAdminByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminServices.updateAdminByID(id as string, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data updated Successfully ",
      data: result,
    });
  }
);

const deleteAdminByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminServices.deleteAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted Successfully ",
      data: result,
    });
  }
);

const softdeleteAdminByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminServices.softDeleteAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted Successfully ",
      data: result,
    });
  }
);

export const adminControllers = {
  getAllAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID,
  softdeleteAdminByID,
};
