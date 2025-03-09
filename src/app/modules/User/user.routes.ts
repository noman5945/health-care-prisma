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
router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  authorise("SUPER_ADMIN", "ADMIN"),
  userController.createDoctor
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  userController.createPatient
);

export const userRoutes = router;
