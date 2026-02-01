import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

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

    otpStore.delete(email);

    return NextResponse.json({ 
      message: "Email verified successfully",
      user: {
        email,
        name: storedData.userData.name,
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
