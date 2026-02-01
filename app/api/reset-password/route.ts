import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ResetCode from "@/models/ResetCode";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    await dbConnect();

    const storedData = await ResetCode.findOne({ email });

    if (!storedData) {
      return NextResponse.json({ error: "No reset request found for this email." }, { status: 400 });
    }

    if (new Date() > storedData.expires) {
      await ResetCode.deleteOne({ email });
      return NextResponse.json({ error: "Reset code has expired." }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: "Invalid reset code." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await ResetCode.deleteOne({ email });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}