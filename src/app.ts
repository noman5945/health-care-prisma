import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes/routes";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Health care server Running..",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);

//Non existent API handle not working
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    error: {
      path: req.originalUrl,
      message: "This API does not exist.",
    },
  });
});

export default app;
