import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";

const router = Router();
router.post("/", ScheduleController.insertSchedule);
router.get("/", authorise(UserRole.DOCTOR), ScheduleController.getAllSchedules);
router.get("/:id", ScheduleController.getScheduleByID);
router.delete("/:id", ScheduleController.deleteScheduleByID);

export const scheduleRoutes = router;
