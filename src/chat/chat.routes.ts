import express from "express";
import deserializeAuthToken from "../middleware/deserialize-auth-token";
import { protectedRoute } from "../middleware/protected-route";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { validateRequest } from "../middleware/validate-request";
import {
  addOrRemoveValidator,
  createGroupChatValidator,
  createOrAccessChatValidator,
  renameGroupChatValidator,
} from "./chat.schema";

const router = express.Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

router.post(
  "/",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(createOrAccessChatValidator),
  chatController.createOrAccessChat
);

router.get("/", deserializeAuthToken, protectedRoute, chatController.getChats);

router.post(
  "/group",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(createGroupChatValidator),
  chatController.createGroup
);

router.put(
  "/group/rename",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(renameGroupChatValidator),
  chatController.renameGroup
);

router.put(
  "/group/remove",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(addOrRemoveValidator),
  chatController.removeFromGroup
);

router.put(
  "/group/add",
  deserializeAuthToken,
  protectedRoute,
  validateRequest(addOrRemoveValidator),
  chatController.addToGroup
);

export default router;
