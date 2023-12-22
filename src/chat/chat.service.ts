import { AppError } from "../errors/custom-error";
import UserModel from "../user/user.model";
import ChatModel from "./chat.model";

export class ChatService {
  async doesChatExist(userId: string, currentUser: string) {
    const chat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUser } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    const userChatWithMsgSenderDetails = await UserModel.populate(chat, {
      path: "latestMessage.sender",
      select: "username profilePhoto email",
    });

    if (chat.length > 0) {
      return userChatWithMsgSenderDetails[0];
    } else {
      const createNewChat = await ChatModel.create({
        chatName: "sender",
        isGroupChat: false,
        users: [userId, currentUser],
      });

      const newChat = ChatModel.findOne({ _id: createNewChat._id }).populate(
        "users",
        "-password"
      );

      return newChat;
    }
  }

  async getAllChats(currentUser: string) {
    const chats = await ChatModel.find({
      users: { $elemMatch: { $eq: currentUser } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const userChatWithMsgSenderDetails = await UserModel.populate(chats, {
      path: "latestMessage.sender",
      select: "username profilePhoto email",
    });

    if (!userChatWithMsgSenderDetails) return "No chats Found";

    return userChatWithMsgSenderDetails;
  }

  async createGroupChat(
    currentUser: string,
    groupName: string,
    users: string[]
  ) {
    const createChat = await ChatModel.create({
      isGroupChat: true,
      chatName: groupName,
      groupAdmin: [currentUser],
      users: [currentUser, ...users],
    });

    const chat = await ChatModel.find({
      _id: createChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return chat;
  }

  async renameGroupChat(newGroupName: string, groupId: string) {
    const group = await ChatModel.findById(groupId);

    if (!group) {
      throw new AppError("Not found", 404);
    }

    if (!group.isGroupChat) {
      throw new AppError("Only group chats can be renamed", 400);
    }

    const renamedGroup = await ChatModel.updateOne(
      { _id: group._id },
      {
        $set: {
          chatName: newGroupName,
        },
      },
      { new: true }
    );

    return renamedGroup;
  }

  async removeUserFromGroup(
    groupId: string,
    userId: string,
    currentUser: string
  ) {
    const group = ChatModel.findOneAndUpdate(
      {
        isGroupChat: true,
        _id: groupId,
        groupAdmin: { $elemMatch: { $eq: currentUser } },
      },
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      throw new AppError("bad request", 400);
    }

    return group;
  }

  async addUserToGroup(groupId: string, userId: string, currentUser: string) {
    const group = ChatModel.findOneAndUpdate(
      {
        isGroupChat: true,
        _id: groupId,
        groupAdmin: { $elemMatch: { $eq: currentUser } },
      },
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      throw new AppError("bad request", 400);
    }

    return group;
  }
}
