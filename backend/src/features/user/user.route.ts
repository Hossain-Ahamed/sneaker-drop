import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { userController } from "./user.controller";

const router = Router();

/**
 * @req POST /users
 * validate body
 * create user
 */
router.post(
  "/",
  validateRequest(UserValidationSchema.createUserSchema),
  userController.createUser,
);

export const userRouter = router;
