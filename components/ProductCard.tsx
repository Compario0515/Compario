"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  slug: string;
  brand: string;
  name: string;
  priceFrom: number;
  priceTo: number;
  retailers: number;
  emoji?: string;
  imageUrl?: string;
}

export default function ProductCard({ slug, brand, name, priceFrom, priceTo, retailers, emoji, imageUrl }: Props) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) { alert("Please sign in to save products."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug }),
      });
      if (res.ok) setLiked(!liked);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/product/${slug}`} className="card hover:border-gray-200 transition-colors block group">
      <div className="relative aspect-square bg-gray-50 rounded-t-xl flex items-center justify-center text-4xl overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-contain p-2" />
        ) : (
          <span>{emoji ?? "✨"}</span>
        )}
        <button
          onClick={toggleWishlist}
          disabled={loading}
          aria-label="Save to My List"
          className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white border flex items-center justify-center text-xs transition-colors
            ${liked ? "border-pink-400 text-pink-500" : "border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100"}`}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{brand}</p>
        <p className="text-[13px] font-medium text-gray-900 leading-snug mb-2 line-clamp-2">{name}</p>
        <p className="text-[13px] font-medium text-gray-900">
          ${priceFrom.toFixed(2)} <span className="font-normal text-gray-400">— ${priceTo.toFixed(2)}</span>
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">Available at {retailers} retailers</p>
      </div>
    </Link>
  );
}
