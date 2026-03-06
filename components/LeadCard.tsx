"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { Bookmark, Phone, Globe, Mail, MapPin, Star } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  isBookmarked?: boolean;
  bookmarkId?: string;
  onRemoveBookmark?: (id: string) => void;
}

export default function LeadCard({
  lead,
  isBookmarked = false,
  bookmarkId: initialBookmarkId,
  onRemoveBookmark,
}: LeadCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [bookmarkId, setBookmarkId] = useState(initialBookmarkId);

  const toggleBookmark = async () => {
    const wasBookmarked = bookmarked;
    const prevBookmarkId = bookmarkId;

    // Optimistic update
    setBookmarked(!bookmarked);

    try {
      if (wasBookmarked && bookmarkId) {
        await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: bookmarkId }),
        });
        setBookmarkId(undefined);
        onRemoveBookmark?.(bookmarkId);
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
        const data = await res.json();
        setBookmarkId(data.bookmark.id);
      }
    } catch {
      // Revert on error
      setBookmarked(wasBookmarked);
      setBookmarkId(prevBookmarkId);
    }
  };

  const address = [lead.address, lead.city, lead.state].filter(Boolean).join(", ");

  return (
    <div className="relative rounded-lg border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className="absolute right-4 top-4 text-zinc-400 transition-colors hover:text-yellow-400"
      >
        <Bookmark
          size={20}
          className={bookmarked ? "fill-yellow-400 text-yellow-400" : ""}
        />
      </button>

      {/* Business Name */}
      <h3 className="mr-8 text-lg font-bold text-white">{lead.businessName}</h3>

      {/* Categories */}
      {lead.categories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lead.categories.map((cat, i) => (
            <span
              key={i}
              className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Rating */}
      {lead.rating > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-white">{lead.rating}</span>
          <span className="text-zinc-500">({lead.reviewsCount} reviews)</span>
        </div>
      )}

      {/* Contact Info */}
      <div className="mt-3 space-y-2 text-sm">
        {lead.phone && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Phone size={14} className="shrink-0" />
            <a href={`tel:${lead.phone}`} className="hover:text-white">
              {lead.phone}
            </a>
          </div>
        )}

        {lead.website && (
          <div className="flex items-center gap-2 text-zinc-400 min-w-0">
            <Globe size={14} className="shrink-0" />
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-white"
            >
              {lead.website}
            </a>
          </div>
        )}

        {lead.email && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Mail size={14} className="shrink-0" />
            <a href={`mailto:${lead.email}`} className="hover:text-white">
              {lead.email}
            </a>
          </div>
        )}

        {address && (
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin size={14} className="shrink-0" />
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
