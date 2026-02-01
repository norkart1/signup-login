"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Verification code sent to your email.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl ring-1 ring-white/10">
        <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
        <p className="text-zinc-500 mb-8 text-sm">Enter your email and we'll send you a reset code.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-black/20"
              placeholder="name@example.com"
            />
          </div>

          {message && <div className="text-green-500 text-sm">{message}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-zinc-500 hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}