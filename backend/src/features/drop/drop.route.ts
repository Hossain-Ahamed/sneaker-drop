import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DropValidationSchema } from "./drop.validation";
import { dropController } from "./drop.controller";

const router = Router();

/** 
 * @req POST /drops
 * validate body
 * create the drop 
 */
router.post(
  "/",
  validateRequest(DropValidationSchema.createDropSchema),
  dropController.createDrop,
);

export const dropRouter = router;
