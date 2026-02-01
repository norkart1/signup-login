import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { resetStore } from "../forgot-password/route";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    await dbConnect();

    const storedData = resetStore.get(email);

    if (!storedData) {
      return NextResponse.json({ error: "No reset request found for this email." }, { status: 400 });
    }

    if (Date.now() > storedData.expires) {
      resetStore.delete(email);
      return NextResponse.json({ error: "Reset code has expired." }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: "Invalid reset code." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    resetStore.delete(email);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}