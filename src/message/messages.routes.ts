import express from "express";
import { MessageController } from "./messages.controller";
import { MessageService } from "./messages.service";
import deserializeAuthToken from "../middleware/deserialize-auth-token";
import { protectedRoute } from "../middleware/protected-route";
import { validateRequest } from "../middleware/validate-request";
import {
  get_all_messages_validator,
  send_message_validator,
} from "./messages.schema";

const router = express.Router();

const messageService = new MessageService();
const messageController = new MessageController(messageService);

router.get(
  "/:chatId",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(get_all_messages_validator),
  messageController.getAllMessages
);

router.post(
  "/",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(send_message_validator),
  messageController.sendMessage
);

export default router;
