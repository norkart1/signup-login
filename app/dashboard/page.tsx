"use strict";
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Detail {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [details, setDetails] = useState<Detail[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const handleLogout = () => {
    // In a real app, you'd also clear cookies/tokens here
    router.push("/login");
  };

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
    <div className="relative min-h-screen font-sans selection:bg-primary/30 bg-background text-foreground">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <nav className="border-b border-white/10 glass px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Dashboard</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">
              Back to Home
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Data <span className="gradient-text">Management</span></h1>
          <p className="text-zinc-500">Manage and store important details securely with MongoDB integration.</p>
        </header>

        <div className="grid w-full gap-8 lg:grid-cols-2">
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
                  className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
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
                  className="w-full rounded-xl border border-zinc-800 bg-white/5 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
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

          <div className="space-y-4 text-left">
            <h2 className="mb-6 text-2xl font-semibold px-2">Stored Records</h2>
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {fetching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-white/5" />
                ))
              ) : details.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-white/10">
                  <p className="text-zinc-500">No records found yet.</p>
                </div>
              ) : (
                details.map((detail) => (
                  <div key={detail._id} className="glass group rounded-2xl p-6 transition-all hover:border-primary/30">
                    <h3 className="mb-1 text-lg font-semibold">{detail.title}</h3>
                    <p className="text-zinc-400">{detail.description}</p>
                    <div className="mt-4 text-xs text-zinc-500">
                      {new Date(detail.createdAt).toLocaleDateString()} at {new Date(detail.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
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