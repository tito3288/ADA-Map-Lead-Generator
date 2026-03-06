"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "@/types";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import LeadCard from "@/components/LeadCard";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/api/bookmarks");
        const data = await res.json();
        setBookmarks(data.bookmarks);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div>
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Bookmarks</h2>
          {!loading && (
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-sm text-zinc-400">
              {bookmarks.length}
            </span>
          )}
        </div>

        {loading && <Spinner />}

        {!loading && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <LeadCard
                key={bookmark.id}
                lead={bookmark.lead}
                isBookmarked={true}
                bookmarkId={bookmark.id}
                onRemoveBookmark={handleRemoveBookmark}
              />
            ))}
          </div>
        )}

        {!loading && bookmarks.length === 0 && (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-lg">No bookmarks yet.</p>
            <p className="mt-1">
              Search for leads and bookmark the ones you want to save.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
