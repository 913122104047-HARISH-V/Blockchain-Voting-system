import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP credentials are not configured");
  }
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const tx = getTransporter();
  const mailOptions = {
    from: smtpFrom,
    to,
    subject,
    text,
    html: html || text,
  };
  try {
    const info = await tx.sendMail(mailOptions);
    logger.info("Email sent", { messageId: info.messageId, to });
    return info;
  } catch (err) {
    logger.error("Failed to send email", err);
    throw err;
  }
}
