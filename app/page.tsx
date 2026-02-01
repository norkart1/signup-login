"use strict";
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Detail {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Home() {
  const [details, setDetails] = useState<Detail[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await fetch("/api/store-details");
      const data = await res.json();
      if (data.success) {
        setDetails(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/store-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setDescription("");
        fetchDetails();
      }
    } catch (err) {
      console.error("Failed to store detail:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
            Modern <span className="gradient-text">Data Storage</span>
          </h1>
          
          <p className="mb-12 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            A sleek, minimalist interface for managing your database details with MongoDB integration. Built with speed and elegance in mind.
          </p>

          <div className="grid w-full gap-8 lg:grid-cols-2">
            {/* Form Section */}
            <div className="glass rounded-3xl p-8 text-left shadow-2xl ring-1 ring-white/10">
              <h2 className="mb-6 text-2xl font-semibold">Store New Detail</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-500">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-black/20"
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-500">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-zinc-800 dark:bg-black/20"
                    placeholder="Enter description..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Storing..." : "Store Data"}
                </button>
              </form>
            </div>

            {/* List Section */}
            <div className="space-y-4 text-left">
              <h2 className="mb-6 text-2xl font-semibold px-2">Stored Records</h2>
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {fetching ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
                  ))
                ) : details.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500">No records found yet.</p>
                  </div>
                ) : (
                  details.map((detail) => (
                    <div key={detail._id} className="glass group rounded-2xl p-6 transition-all hover:border-primary/30">
                      <h3 className="mb-1 text-lg font-semibold">{detail.title}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{detail.description}</p>
                      <div className="mt-4 text-xs text-zinc-400">
                        {new Date(detail.createdAt).toLocaleDateString()} at {new Date(detail.createdAt).toLocaleDateTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-sm text-zinc-500">
        <p>© 2026 Modern App. Powered by Next.js & MongoDB.</p>
      </footer>
    </div>
  );
}
