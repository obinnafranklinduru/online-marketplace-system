import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// Define interfaces for access code result and mail options
interface AccessCodeResult {
  code: number;
  expiry: Date;
}

interface MailOptions {
  code: number;
  email: string;
}

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL!,
    pass: process.env.APP_PASSWORD!,
  },
});

// Create a mail generator
const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "User Service",
    link: process.env.BASE_URL! || "http://localhost:3000",
  },
});

// Function to generate a random access code and expiry date
export const GenerateAccessCode = (): AccessCodeResult => {
  const code: number = Math.floor(10000 + Math.random() * 900000);
  let expiry: Date = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { code, expiry };
};

// Function to send a verification code via email
export const SendVerificationCode = async ({
  code,
  email,
}: MailOptions): Promise<void> => {
  const response = {
    body: {
      intro: `OTP: <b>${code}</b>`,
      outro: "Note that this code is valid for 30 minutes.",
    },
  };

  const mail = MailGenerator.generate(response);
  const message = {
    from: `'User Service' <${process.env.SENDER_EMAIL!}>`,
    to: email,
    subject: "Authentication",
    html: mail,
  };

  try {
    await transporter.sendMail(message);
    console.log("Mail sent successfully");
  } catch (error) {
    throw new Error(error);
  }
};
