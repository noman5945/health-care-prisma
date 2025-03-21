import { Router } from "express";
import { moduleRouterArray } from "../types/routesArray";
import { AdminRouter } from "../modules/Admin/admin.routes";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRouter } from "../modules/Auth/auth.routes";
import { specialtiesRoutes } from "../modules/Specialties/specialties.route";
import { doctorsRoutes } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.routes";

const router = Router();

const moduleRoutes: moduleRouterArray = [
  {
    path: "/admin",
    route: AdminRouter,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/specialties",
    route: specialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorsRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
