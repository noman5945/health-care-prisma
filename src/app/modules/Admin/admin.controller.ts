import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { utilFunctions } from "../../utils/utils";
import { paginationOptions, queryOptions } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {
  const query = utilFunctions.pickFilters(req.query, queryOptions);
  const pagination = utilFunctions.pickFilters(req.query, paginationOptions);

  try {
    const result = await adminServices.getAllAdmins(query, pagination);
    res.status(200).json({
      success: true,
      message: "All Admins fetched Successfully ",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const getAdminByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminServices.getAdminByID(id as string);
    res.status(200).json({
      success: true,
      message: "All Admins fetched Successfully ",
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

const updateAdminByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminServices.updateAdminByID(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Admin data updated Successfully ",
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
const deleteAdminByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminServices.deleteAdminByID(id as string);
    res.status(200).json({
      success: true,
      message: "Admin data deleted Successfully ",
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
const softdeleteAdminByID = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await adminServices.softDeleteAdminByID(id as string);
    res.status(200).json({
      success: true,
      message: "Admin data deleted Successfully ",
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

export const adminControllers = {
  getAllAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID,
  softdeleteAdminByID,
};
