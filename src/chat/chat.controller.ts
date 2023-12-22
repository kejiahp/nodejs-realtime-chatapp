import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { ChatService } from "./chat.service";

export class ChatController {
  private readonly chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  createOrAccessChat = tryCatch(async (req: Request, res: Response) => {
    const { userId } = req.body;
    const currentUserId = res.locals.user.uid;

    const chat = await this.chatService.doesChatExist(userId, currentUserId);

    return res.status(200).send(chat);
  });

  public getChats = tryCatch(async (req: Request, res: Response) => {
    const currentUser = res.locals.user.uid;

    const allChats = await this.chatService.getAllChats(currentUser);

    return res.send(allChats);
  });

  public createGroup = tryCatch(async (req: Request, res: Response) => {
    const { groupName, users } = req.body;
    const currentUser = res.locals.user.uid;

    const group = await this.chatService.createGroupChat(
      currentUser,
      groupName,
      users
    );
    return res.send(group);
  });

  public renameGroup = tryCatch(async (req: Request, res: Response) => {
    const { newGroupName, groupId } = req.body;

    await this.chatService.renameGroupChat(newGroupName, groupId);
    return res.send("renamed successfully");
  });

  public removeFromGroup = tryCatch(async (req: Request, res: Response) => {
    const { groupId, userId } = req.body;
    const currentUser = res.locals.user.uid;

    await this.chatService.removeUserFromGroup(groupId, userId, currentUser);

    return res.send("removed successfully");
  });

  public addToGroup = tryCatch(async (req: Request, res: Response) => {
    const { groupId, userId } = req.body;
    const currentUser = res.locals.user.uid;

    await this.chatService.addUserToGroup(groupId, userId, currentUser);

    return res.send("added successfully");
  });
}
