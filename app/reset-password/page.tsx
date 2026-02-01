"use strict";
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent px-4">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center shadow-2xl ring-1 ring-white/10">
          <div className="w-16 h-16 bg-green-100/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
          <p className="text-zinc-500 mb-6">Your password has been updated. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl ring-1 ring-white/10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Set New Password</h1>
        <p className="text-zinc-500 mb-8 text-sm">Enter the code sent to your email and your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500">Reset Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-center tracking-widest font-mono"
              placeholder="000000"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}