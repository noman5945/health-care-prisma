import { Router } from "express";
import { AuthController } from "./auth.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", AuthController.loginUser);
router.get("/refreshtoken", AuthController.getNewAccessToken);
router.post(
  "/changepass",
  authorise(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  AuthController.changePassword
);
router.post("/forgotpass", AuthController.forgotPassword);
router.post("/reset-pass", AuthController.resetPassword);
export const AuthRouter = router;
