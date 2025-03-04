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

router.get(
  "/:id",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAdminByID
);
router.patch(
  "/:id",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.updateAdminByID
);
router.delete(
  "/:id",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.deleteAdminByID
);
router.delete(
  "/softdel/:id",
  authorise(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.softdeleteAdminByID
);

export const AdminRouter = router;
