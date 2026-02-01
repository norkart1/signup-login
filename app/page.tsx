"use strict";
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={140}
            height={28}
            priority
          />
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
          Secure <span className="gradient-text">Authentication</span>
        </h1>
        
        <p className="mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
          Welcome to our modern authentication platform. Experience seamless signup and login with top-tier security and a sleek user interface.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary px-8 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] sm:w-[180px]"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="glass flex h-14 w-full items-center justify-center rounded-2xl px-8 font-semibold transition-all hover:bg-white/10 active:scale-[0.98] sm:w-[180px]"
          >
            Log In
          </Link>
        </div>

        <div className="mt-16">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-zinc-500 hover:text-primary transition-colors"
          >
            Manage Data Details →
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full py-12 text-center text-sm text-zinc-500">
        <p>© 2026 Modern Auth. Powered by Next.js & MongoDB.</p>
      </footer>
    </div>
  );
}
