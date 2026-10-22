import nodemailer from "nodemailer";
import { MAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../../config";

export const isMailConfigured = (): boolean => !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
};

export const sendMail = async (to: string, subject: string, text: string): Promise<void> => {
  await getTransporter().sendMail({ from: MAIL_FROM, to, subject, text });
};
