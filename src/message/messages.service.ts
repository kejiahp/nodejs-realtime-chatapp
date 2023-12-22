import ChatModel from "../chat/chat.model";
import UserModel from "../user/user.model";
import MessageModel from "./message.model";

export class MessageService {
  public async getAllMessagesService(chatId: string) {
    const allMessages = await MessageModel.find({ chat: chatId })
      .populate("sender", "username profilePhoto email")
      .populate("chat");

    return allMessages;
  }

  public async sendMessageService(
    currentUser: string,
    content: string,
    chatId: string
  ) {
    const message = await MessageModel.create({
      sender: currentUser,
      content,
      chat: chatId,
    });

    const populatedMessage = await (
      await message.populate("sender", "username profilePhoto")
    ).populate("chat");

    const userPopulatedMessage = await UserModel.populate(populatedMessage, {
      path: "chat.users",
      select: "username profilePhoto email",
    });

    await ChatModel.findByIdAndUpdate(
      chatId,
      { latestMessage: message },
      { new: true }
    );

    return userPopulatedMessage;
  }
}
