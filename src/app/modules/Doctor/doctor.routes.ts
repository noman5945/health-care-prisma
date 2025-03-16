import { Router } from "express";
import { doctorControllers } from "./doctor.controller";

const router = Router();
router.patch("/:id", doctorControllers.updateDoctorData);

export const doctorsRoutes = router;
