import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message, attachments } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions: any = {
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: `<p>${message}</p>`,
    };

    // If there are attachments, add them to mailOptions
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((file: any) => ({
        filename: file.filename,
        content: file.content.split(";base64,").pop(), // Extract Base64 content
        encoding: "base64",
      }));
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ error: "Error sending message" }, { status: 500 });
  }
}