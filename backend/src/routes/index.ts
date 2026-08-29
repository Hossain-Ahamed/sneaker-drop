import { Router } from "express";
import { TRoutes } from "../interfaces";
import { dropRouter } from "../features/drop/drop.route";
import { userRouter } from "../features/user/user.route";

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
    /**
     * User Router
     * Manage test users
     */
  {
    path: "/users",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
