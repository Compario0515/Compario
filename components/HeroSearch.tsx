"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TRENDING = [
  "Beauty of Joseon Relief Sun",
  "AHC Eye Cream",
  "COSRX Snail Mucin",
  "Laneige Lip Mask",
  "Some By Mi Toner",
  "SKIN1004 Centella",
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="text-center py-14 -mx-4 px-4 bg-gray-50 mb-10">
      <h1 className="text-4xl font-medium tracking-tight mb-7 text-gray-900">
        Find Your Perfect Glow
      </h1>

      <div className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-1.5 max-w-xl mx-auto mb-5 gap-2 shadow-sm">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="flex-1 text-sm py-1 focus:outline-none bg-transparent placeholder-gray-400"
          placeholder="Search brands, products, or ingredients…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search(query)}
          autoFocus
        />
        <button onClick={() => search(query)} className="bg-gray-900 text-white text-sm rounded-full px-5 py-1.5 font-medium hover:bg-gray-700 transition-colors flex-shrink-0">
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 mr-1">Trending</span>
        {TRENDING.map(t => (
          <button
            key={t}
            onClick={() => search(t)}
            className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors bg-white"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
