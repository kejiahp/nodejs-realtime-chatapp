import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../middleware/validate-request";
import { userSearchValidationSchema } from "./user.schema";
import deserializeAuthToken from "../middleware/deserialize-auth-token";
import { protectedRoute } from "../middleware/protected-route";

const router = express.Router();

const userController = new UserController();

router.get(
  "/",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(userSearchValidationSchema),
  userController.getAllUsers
);

export default router;
