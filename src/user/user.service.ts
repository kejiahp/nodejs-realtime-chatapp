import { omit } from "lodash";
import UserModel, { IUserSchema } from "./user.model";
import { AppError } from "../errors/custom-error";
import cloudinary from "../utils/cloudinary";
import { Request } from "express";
import { nanoid } from "nanoid";
import config from "config";
import { mailTransporter } from "../utils/custom-mailer";
import mongoose from "mongoose";
import { hashPassword } from "../utils/hash-password";

type ObjectId = mongoose.Types.ObjectId;

export const createUserService = async ({
  username,
  email,
  password,
  file,
}: Omit<IUserSchema, "isAdmin" | "createdAt" | "updatedAt"> & {
  file: Express.Multer.File;
}) => {
  const userExist = await UserModel.findOne({ email: email });

  if (userExist) {
    throw new AppError("user with this email already exist", 400);
  }

  const result = await cloudinary.uploader.upload(file.path);

  const hashedPassword = await hashPassword(password);

  const payload = {
    username,
    email,
    password: hashedPassword,
    profilePhoto: result.secure_url,
    cloudinaryPublicId: result.public_id,
  };

  const user = await UserModel.create(payload);

  return omit(user.toJSON(), "password");
};

export const loginUserService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new AppError("invalid credentials", 401);
  }

  const validUser = await user.comparePassword(password);

  if (!validUser) {
    throw new AppError("invalid credentials", 401);
  }

  return omit(user.toJSON(), "password");
};

export const forgotPasswordService = async ({
  email,
  context,
}: {
  email: string;
  context: Request;
}) => {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new AppError("Invalid email", 404);
  }

  const userResetCode = nanoid();

  const EMAIL = config.get("MAILING_EMAIL") as string;

  const mailOptions = {
    from: EMAIL,
    to: email,
  };

  const passwordResetLink = `${context.protocol}://${context.hostname}/verify-password-reset?code=${userResetCode}`;

  const EMAILHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Mail</title>
  </head>
  <body>
      <h3>Hello ${email} click the link below to reset your email</h3>
      <div style="margin: 20px 0px;font-size:20px;">
          <a href="${passwordResetLink}">Click Here</a>
      </div>
  </body>
  </html>
  `;

  await mailTransporter.sendMail({
    ...mailOptions,
    subject: `Password reset mail`,
    text: `heres the password reset mail you requested`,
    html: EMAILHTML,
  });

  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    { $set: { passwordResetCode: userResetCode } },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError("Something went wrong", 500);
  }

  return "Email Sent";
};

export const verifyPasswordResetCodeService = async (
  code: string,
  password: string
) => {
  const userExist = await UserModel.findOne({ passwordResetCode: code });

  if (!userExist) throw new AppError("invalid code", 400);

  const hashedPassword = await hashPassword(password);

  const user = await UserModel.findByIdAndUpdate(userExist._id, {
    $set: { passwordResetCode: "", password: hashedPassword },
  });

  if (!user) throw new AppError("invalid code", 400);

  return "Password Reset Successful";
};

export const findUserService = async (userId: string | ObjectId) => {
  return await UserModel.findById(userId);
};

export const userSearchService = async (
  keyword: string,
  currentUserId: string
) => {
  const searchParam = keyword
    ? {
        $or: [
          { username: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const users = await UserModel.find(searchParam).find({
    _id: { $ne: currentUserId },
  });

  return users;
};
