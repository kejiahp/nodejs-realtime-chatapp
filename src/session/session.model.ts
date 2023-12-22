import mongoose from "mongoose";

export interface ISessionSchema {
  userId: mongoose.Types.ObjectId;
  isValid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema<ISessionSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model("Session", SessionSchema);

export default SessionModel;
