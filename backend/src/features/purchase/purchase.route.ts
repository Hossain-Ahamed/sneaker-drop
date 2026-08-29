import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PurchaseValidationSchema } from "./purchase.validation";
import { purchaseController } from "./purchase.controller";

const router = Router();

/**
 * @req POST /purchases
 * validate body
 * complete the reservation and record the purchase
 */
router.post(
  "/",
  validateRequest(PurchaseValidationSchema.createPurchaseSchema),
  purchaseController.createPurchase,
);

export const purchaseRouter = router;
