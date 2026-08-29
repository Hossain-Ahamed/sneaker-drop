import { Router } from "express";
import { TRoutes } from "../interfaces";
import { dropRouter } from "../features/drop/drop.route";

const router = Router();

const moduleRoutes: TRoutes[] = [
    /**
     * Drop Router
     * Manage product 
     */
  {
    path: "/drops",
    route: dropRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
