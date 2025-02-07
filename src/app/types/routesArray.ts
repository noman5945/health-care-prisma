import { Router } from "express";

type moduleRouter = {
  path: string;
  route: Router;
};

export type moduleRouterArray = moduleRouter[];
