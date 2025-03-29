import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

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

export const DoctorScheduleController = {
  createNewDoctorSchedule,
};
