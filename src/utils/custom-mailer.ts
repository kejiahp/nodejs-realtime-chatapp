import nodemailer from "nodemailer";
import config from "config";

const EMAIL = config.get("MAILING_EMAIL") as string;
const EMAIL_PASS = config.get("MAILING_PASSWORD") as string;

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});
