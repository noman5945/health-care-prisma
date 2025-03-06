import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import authorise from "../../middlewares/authMiddeware";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  authorise("SUPER_ADMIN", "ADMIN"),
  userController.createAdmin
);

export const userRoutes = router;
