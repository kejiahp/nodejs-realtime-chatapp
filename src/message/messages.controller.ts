import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { MessageService } from "./messages.service";

export class MessageController {
  private readonly messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  public getAllMessages = tryCatch(async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const messages = await this.messageService.getAllMessagesService(chatId);

    res.send(messages);
  });

  public sendMessage = tryCatch(async (req: Request, res: Response) => {
    const currentUser = res.locals.user.uid;
    const { content, chatId } = req.body;

    const message = await this.messageService.sendMessageService(
      currentUser,
      content,
      chatId
    );

    return res.send(message);
  });
}
