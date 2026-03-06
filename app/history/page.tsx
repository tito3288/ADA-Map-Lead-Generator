"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchHistoryEntry } from "@/types";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { Trash2, RotateCw } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setHistory(data.history);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
  };

  return (
    <div>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page Title + Clear Button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Search History</h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-red-800 hover:text-red-400 sm:px-4 sm:py-2"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear History</span>
              <span className="sm:hidden">Clear</span>
            </button>
          )}
        </div>

        {loading && <Spinner />}

        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {entry.keyword}{" "}
                    <span className="text-zinc-500">in</span>{" "}
                    {entry.city}, {entry.state}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                    <span>{entry.resultCount} results</span>
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/?keyword=${encodeURIComponent(entry.keyword)}&city=${encodeURIComponent(entry.city)}&state=${encodeURIComponent(entry.state)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white sm:w-auto"
                >
                  <RotateCw size={14} />
                  Search Again
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-lg">No search history yet.</p>
            <p className="mt-1">Your searches will appear here automatically.</p>
          </div>
        )}
      </main>
    </div>
  );
}
