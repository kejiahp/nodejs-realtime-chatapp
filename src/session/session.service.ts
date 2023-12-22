import SessionModel, { ISessionSchema } from "./session.model";
import mongoose, { FilterQuery } from "mongoose";

type ObjectId = mongoose.Types.ObjectId;

export const createSessionService = async ({
  userId,
  userAgent,
}: {
  userId: string | ObjectId;
  userAgent?: string;
}) => {
  const session = await SessionModel.create({
    userId: userId,
    userAgent: userAgent || "",
  });

  return session.toJSON();
};

export const findSessionById = async (sessionId: string | ObjectId) => {
  return await SessionModel.findById(sessionId);
};

export const findManySessionService = async ({
  query,
}: {
  query: FilterQuery<ISessionSchema>;
}) => {
  return await SessionModel.find({ query });
};

export const invalidateAllUserSessionService = async ({
  userId,
}: {
  userId: string | ObjectId;
}) => {
  return await SessionModel.updateMany(
    { userId: userId },
    { $set: { isValid: false } },
    { new: true }
  );
};

export const invalidateSessionById = async (sessionId: string | ObjectId) => {
  return await SessionModel.findByIdAndUpdate(
    sessionId,
    { $set: { isValid: false } },
    { new: true }
  );
};
