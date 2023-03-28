import { isPost, notFound } from "@/lib/api";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (isPost(req)) {
    const transporter = nodemailer.createTransport({
      host: "ajc-formation.fr",
      port: 587, // or your custom port
      secure: false, // if you're not using SSL/TLS
      auth: {
        user: "cbirette@ajc-formation.fr",
        pass: process.env.MAIL_PWD,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "cbirette@ajc-formation.fr",
      to: "cbirette@ajc-formation.fr",
      subject: "Test email",
      html: "<h1>Hello, World!</h1>",
    });
  } else return notFound(res, "");
}
