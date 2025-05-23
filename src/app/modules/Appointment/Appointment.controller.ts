import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { AppointmentServices } from "./Appointment.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../Auth/auth.interface";

const createNewAppointment = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const user = req.user as IAuthUser;
    const result = await AppointmentServices.createNewAppointment(
      user,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment created",
      data: result,
    });
  }
);

const getMyAppointments = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const user = req.user as IAuthUser;
    const filters = utilFunctions.pickFilters(req.query, [
      "status",
      "paymentStatus",
    ]);
    const options = utilFunctions.pickFilters(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const result = await AppointmentServices.getMyAppointments(
      user,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointments fetched",
      data: result,
    });
  }
);

export const AppointmentController = {
  createNewAppointment,
  getMyAppointments,
};
