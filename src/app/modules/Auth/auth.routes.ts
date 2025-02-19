import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/", AuthController.loginUser);
router.get("/refreshtoken", AuthController.getNewAccessToken);
export const AuthRouter = router;
