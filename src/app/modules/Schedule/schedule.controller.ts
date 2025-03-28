import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const insertSchedule = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const result = await ScheduleService.createNewScheduleIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "New Schedule created",
      data: result,
    });
  }
);

export const ScheduleController = {
  insertSchedule,
};
