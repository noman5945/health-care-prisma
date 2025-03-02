import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import authorise from "../../middlewares/authMiddeware";

const router = express.Router();

router.post("/", authorise("SUPER_ADMIN", "ADMIN"), userController.createAdmin);

export const userRoutes = router;
