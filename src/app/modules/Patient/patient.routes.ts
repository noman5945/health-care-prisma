import { Router } from "express";
import { PatientsController } from "./patient.controller";

const router = Router();
router.get("/", PatientsController.getAllPatients);
export const patientRoutes = router;
