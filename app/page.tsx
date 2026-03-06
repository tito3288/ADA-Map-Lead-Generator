"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Lead } from "@/types";
import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import LeadCard from "@/components/LeadCard";
import { Search, MapPin, Phone, Globe, Star } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [limit, setLimit] = useState(10);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    setLeads([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, city, state, limit }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [keyword, city, state, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  useEffect(() => {
    const qKeyword = searchParams.get("keyword");
    const qCity = searchParams.get("city");
    const qState = searchParams.get("state");
    if (qKeyword && qCity && qState) {
      runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Inline Search Bar */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-2">
          <div className="flex-[2]">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Keyword
            </label>
            <input
              type="text"
              placeholder="e.g. plumber, dentist, realtor"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid flex-[3] grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. South Bend"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Indiana"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Max Results
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            <Search size={16} />
            <span className="lg:hidden">Find My Leads</span>
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="mt-8">
          <Spinner message="Scraping Google Maps..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && leads.length > 0 && (
        <div className="mt-6">
          <p className="mb-4 text-zinc-400">
            Found <span className="font-medium text-white">{leads.length}</span> results
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead, index) => (
              <LeadCard key={index} lead={lead} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
            <MapPin size={36} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Discover Local Business Leads
          </h2>
          <p className="mt-2 max-w-md text-zinc-400">
            Search by keyword and location to find business contact information,
            ratings, and more.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-400">
              <Phone size={14} />
              Phone numbers
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-400">
              <Globe size={14} />
              Websites
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-400">
              <Star size={14} />
              Ratings & reviews
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Spinner />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
