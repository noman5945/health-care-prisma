import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import { utilFunctions } from "../../utils/utils";

const getAllAdmins = async (req: Request, res: Response) => {
  const query = utilFunctions.pickFilters(req.query, [
    "name",
    "email",
    "searchTerm",
    "contactNumber",
  ]);
  try {
    const result = await adminServices.getAllAdmins(query);
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
