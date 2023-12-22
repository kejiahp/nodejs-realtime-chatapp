import express from "express";

import {
  forgotPasswordController,
  loginUserController,
  logoutController,
  refreshTokenController,
  signUpUserController,
  verifyPasswordResetCodeController,
} from "./auth.controller";
import { validateRequest } from "../middleware/validate-request";
import upload from "../middleware/multer";
import {
  forgotPasswordSchema,
  loginValidationSchema,
  refreshTokenSchema,
  signUpValidationSchema,
  verifyPasswordResetSchema,
} from "./auth.schema";
import deserializeAuthToken from "../middleware/deserialize-auth-token";
import { protectedRoute } from "../middleware/protected-route";

const router = express.Router();

router.post(
  "/signup",
  upload.single("profilePhoto"),
  validateRequest(signUpValidationSchema),
  signUpUserController
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  loginUserController
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  "/verify-password-reset",
  validateRequest(verifyPasswordResetSchema),
  verifyPasswordResetCodeController
);

router.post(
  "/refresh",
  validateRequest(refreshTokenSchema),
  refreshTokenController
);

router.post("/logout", deserializeAuthToken, protectedRoute, logoutController);

export default router;
