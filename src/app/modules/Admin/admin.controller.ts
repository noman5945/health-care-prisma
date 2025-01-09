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
};
