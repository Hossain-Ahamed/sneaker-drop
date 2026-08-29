import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidationSchema } from "./user.validation";
import { userController } from "./user.controller";

const router = Router();

/**
 * @req POST /users
 * validate body
 * create user and set their identity cookie
 */
router.post(
  "/",
  validateRequest(UserValidationSchema.createUserSchema),
  userController.createUser,
);

/**
 * @req POST /users/signin
 * validate body
 * sign an existing user in by username
 */
router.post(
  "/signin",
  validateRequest(UserValidationSchema.signInSchema),
  userController.signIn,
);

/**
 * @req GET /users/me
 * resolve the caller from their identity cookie
 */
router.get("/me", userController.getCurrentUser);

/**
 * @req POST /users/signout
 * clear the identity cookie
 */
router.post("/signout", userController.signOut);

export const userRouter = router;
