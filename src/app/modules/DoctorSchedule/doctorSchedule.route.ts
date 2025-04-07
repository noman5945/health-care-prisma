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

router.get(
  "/",
  authorise(UserRole.DOCTOR),
  DoctorScheduleController.getDoctorSchedule
);

router.delete(
  "/:id",
  authorise(UserRole.DOCTOR),
  DoctorScheduleController.deleteDoctorSchedule
);

export const doctorScheduleRoutes = router;
