import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Temporary store for reset codes
const resetStore = new Map<string, { code: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security, but we'll return success message
      return NextResponse.json({ message: "If an account exists, a code has been sent." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 mins

    resetStore.set(email, { code, expires });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const domain = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : process.env.DOMAIN;

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset</h2>
          <p>Your password reset code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
          </div>
          <p style="margin-top: 20px;">After copying the code, click here to reset your password:</p>
          <a href="${domain}/reset-password" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Reset code sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export { resetStore };