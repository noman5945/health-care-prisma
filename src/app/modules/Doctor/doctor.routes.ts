import { Router } from "express";
import { doctorControllers } from "./doctor.controller";

const router = Router();
router.patch("/:id", doctorControllers.updateDoctorData);
router.patch("/:id", doctorControllers.softDeleteDoctorData);
router.get("/", doctorControllers.getAllDoctors);
router.delete("/:id", doctorControllers.deleteDoctorData);

export const doctorsRoutes = router;
