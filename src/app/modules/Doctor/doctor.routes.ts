import { Router } from "express";
import { doctorControllers } from "./doctor.controller";

const router = Router();
router.patch("/:id", doctorControllers.updateDoctorData);
router.get("/", doctorControllers.getAllDoctors);

export const doctorsRoutes = router;
