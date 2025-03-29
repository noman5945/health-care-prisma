import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  authorise(UserRole.DOCTOR),
  DoctorScheduleController.createNewDoctorSchedule
);

export const doctorScheduleRoutes = router;
