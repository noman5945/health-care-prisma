import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import { utilFunctions } from "../../utils/utils";
import { paginationOptions, queryOptions } from "./admin.constants";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = utilFunctions.pickFilters(req.query, queryOptions);
  const pagination = utilFunctions.pickFilters(req.query, paginationOptions);

  try {
    const result = await adminServices.getAllAdmins(query, pagination);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Admins fetched Successfully ",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

const getAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await adminServices.getAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Admins fetched Successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

const updateAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await adminServices.updateAdminByID(id as string, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data updated Successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};
const deleteAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await adminServices.deleteAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted Successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};
const softdeleteAdminByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await adminServices.softDeleteAdminByID(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted Successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

export const adminControllers = {
  getAllAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID,
  softdeleteAdminByID,
};
