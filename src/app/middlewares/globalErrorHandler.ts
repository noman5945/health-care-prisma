import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (err: any, res: Response, next: NextFunction) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.name || "Something went wrong",
    error: err,
  });
};

export default globalErrorHandler;
