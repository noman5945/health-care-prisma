import { Router } from "express";
import { specialtyControllers } from "./specialties.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";

const router = Router();

router.post(
  "/",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  specialtyControllers.createNewSpecialty
);

export const specialtiesRoutes = router;
