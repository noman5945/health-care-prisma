import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IAuthUser } from "../Auth/auth.interface";

const createNewDoctorSchedule = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const user = req.user;
    const selectedSchedules = req.body;
    const result = await DoctorScheduleService.createNewDoctorSchedule(
      user,
      selectedSchedules
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Slots selected seccessfully",
      data: result,
    });
  }
);

const getDoctorSchedule = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const filter = utilFunctions.pickFilters(req.query, [
      "startDateTime",
      "endDateTime",
      "isBooked",
    ]);
    const pageOptions = utilFunctions.pickFilters(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const user = req.user as IAuthUser;

    const result = await DoctorScheduleService.getMySchedule(
      user,
      filter,
      pageOptions
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Your Schedule fetched seccessfully",
      data: result,
    });
  }
);

const deleteDoctorSchedule = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const user = req.user as IAuthUser;
    const scheduleId = req.params.id;
    const result = await DoctorScheduleService.deleteDoctorSchedule(
      user,
      scheduleId
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Your Schedule deleted seccessfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createNewDoctorSchedule,
  getDoctorSchedule,
  deleteDoctorSchedule,
};
