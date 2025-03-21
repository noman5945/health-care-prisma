import { Router } from "express";
import { PatientsController } from "./patient.controller";

const router = Router();
router.get("/", PatientsController.getAllPatients);

router.get("/:id", PatientsController.getPatientByID);

router.delete("/:id", PatientsController.deletePatient);

router.patch("/soft-delete/:id", PatientsController.softDeletePatient);

router.patch("/update/:id", PatientsController.updatePatientData);

export const patientRoutes = router;
