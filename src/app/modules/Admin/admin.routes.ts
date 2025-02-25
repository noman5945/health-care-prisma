import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getAdminByID);
router.patch("/:id", adminControllers.updateAdminByID);
router.delete("/:id", adminControllers.deleteAdminByID);
router.delete("/softdel/:id", adminControllers.softdeleteAdminByID);

export const AdminRouter = router;
