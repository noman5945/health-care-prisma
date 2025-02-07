import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonBody: {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
      limit: number;
      page: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(jsonBody.statusCode).json({
    success: jsonBody.success,
    message: jsonBody.message,
    meta: jsonBody.meta || null,
    data: jsonBody.data,
  });
};

export default sendResponse;
