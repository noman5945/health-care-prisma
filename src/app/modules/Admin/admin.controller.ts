import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllAdmins();
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
