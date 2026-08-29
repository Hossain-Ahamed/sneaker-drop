import { Router } from "express";
import { TRoutes } from "../interfaces";
import { dropRouter } from "../features/drop/drop.route";
import { userRouter } from "../features/user/user.route";
import { reservationRouter } from "../features/reservation/reservation.route";
import { purchaseRouter } from "../features/purchase/purchase.route";

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
   * Manage users
   */
  {
    path: "/users",
    route: userRouter,
  },
  /**
   * Reservation Router
   * Manage reservations
   */
  {
    path: "/reservations",
    route: reservationRouter,
  },
  /**
   * Purchase Router
   * Manage purchases
   */
  {
    path: "/purchases",
    route: purchaseRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
