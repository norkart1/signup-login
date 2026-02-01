import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return NextResponse.json({ error: "No OTP found for this email. Please request a new one." }, { status: 400 });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Store user in DB
    await dbConnect();
    const hashedPassword = await bcrypt.hash(storedData.userData.password, 10);
    
    await User.create({
      name: storedData.userData.name,
      email: email,
      password: hashedPassword,
    });

    otpStore.delete(email);

    return NextResponse.json({ 
      message: "Email verified and account created successfully",
      user: {
        email,
        name: storedData.userData.name,
      }
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
