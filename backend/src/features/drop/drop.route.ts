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

/**
 * @req GET /drops
 * list all drop items with available stock limit
 */
router.get("/", dropController.listDrops);

export const dropRouter = router;
