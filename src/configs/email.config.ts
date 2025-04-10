import nodemailer from "nodemailer";
import config from "./config";

export const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailSecure, // true nếu port 465
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});
