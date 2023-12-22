import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUserSchema {
  username: string;
  email: string;
  password: string;
  passwordResetCode: string;
  cloudinaryPublicId: string;
  profilePhoto: string;
  isAdmin: boolean;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUserSchema>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      unique: true,
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    passwordResetCode: {
      type: String,
      required: false,
    },
    cloudinaryPublicId: {
      type: String,
      required: false,
    },
    profilePhoto: {
      type: String,
      required: [true, "profilePhoto is required"],
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password).catch((error: any) => false);
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
