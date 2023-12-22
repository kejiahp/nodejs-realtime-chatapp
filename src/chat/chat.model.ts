import mongoose from "mongoose";

export interface IChatSchema {
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
  groupAdmin: mongoose.Types.ObjectId[];
}

const ChatSchema = new mongoose.Schema<IChatSchema>(
  {
    chatName: {
      type: String,
      trim: true,
      required: [true, "chatName is required"],
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

export default ChatModel;
