import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import authorise from "../../middlewares/authMiddeware";
import { fileUploader } from "../../utils/fileUploader";
import { UserRole } from "@prisma/client";

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

router.get(
  "/",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAllUsers
);

router.get(
  "/me",
  authorise(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.PATIENT,
    UserRole.DOCTOR
  ),
  userController.getUserProfile
);

export const userRoutes = router;
