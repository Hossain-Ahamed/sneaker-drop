import { Router } from "express";
import { TRoutes } from "../interfaces";

const router = Router();


const moduleRoutes: TRoutes[] = [

  /**
   * 
   * 
   */
 

];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
