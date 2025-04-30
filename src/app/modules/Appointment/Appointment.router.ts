import { Router } from "express";
import { AppointmentController } from "./Appointment.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";

const router = Router();

// define routes here
router.post(
  "/",
  authorise(UserRole.PATIENT),
  AppointmentController.createNewAppointment
);

export const appointmentRoutes = router;
