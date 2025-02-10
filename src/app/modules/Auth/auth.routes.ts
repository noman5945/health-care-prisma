import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/", AuthController.loginUser);

export const AuthRouter = router;
