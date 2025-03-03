import express from "express";
import { adminControllers } from "./admin.controller";
import authorise from "../../middlewares/authMiddeware";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAllAdmins
);

router.get("/:id", adminControllers.getAdminByID);
router.patch("/:id", adminControllers.updateAdminByID);
router.delete("/:id", adminControllers.deleteAdminByID);
router.delete("/softdel/:id", adminControllers.softdeleteAdminByID);

export const AdminRouter = router;
