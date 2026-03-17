import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

export async function sendEmail({ to, subject, text, html }) {
  // ✅ Gmail transporter (no SMTP config)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: html || text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent", { messageId: info.messageId, to });
    return info;
  } catch (err) {
    logger.error("Failed to send email", err);
    throw err;
  }
}