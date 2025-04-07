import { Request, Response } from "express";
import { utilFunctions } from "../../utils/utils";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { scheduleSerchableFields } from "./shedule.constants";
import { IAuthUser } from "../Auth/auth.interface";

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

const getAllSchedules = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const scheduleFilter = utilFunctions.pickFilters(
      req.query,
      scheduleSerchableFields
    );

    const schedulePagination = utilFunctions.pickFilters(req.query, [
      "limit",
      "page",
      "sortBy",
      "sortOrder",
    ]);
    const user = req.user as IAuthUser;
    const result = await ScheduleService.getAllSchedules(
      scheduleFilter,
      schedulePagination,
      user
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedules fetched",
      data: result,
    });
  }
);

const getScheduleByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const scheduleID = req.params.id;
    const result = await ScheduleService.getScheduleByID(scheduleID);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedules fetched",
      data: result,
    });
  }
);

const deleteScheduleByID = utilFunctions.handleRequestTryCatch(
  async (req: Request, res: Response) => {
    const scheduleID = req.params.id;
    const result = await ScheduleService.deleteSchedule(scheduleID);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedules deleted",
      data: result,
    });
  }
);

export const ScheduleController = {
  insertSchedule,
  getAllSchedules,
  getScheduleByID,
  deleteScheduleByID,
};
