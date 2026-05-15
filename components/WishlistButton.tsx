"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";

export default function WishlistButton({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  async function toggle() {
    if (!session) { setShowAuth(true); return; }
    const res = await fetch("/api/wishlist", {
      method: liked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: slug }),
    });
    if (res.ok) setLiked(!liked);
  }

  return (
    <>
      <button
        onClick={toggle}
        className={`text-sm border rounded-full px-3 py-0.5 flex items-center gap-1.5 transition-colors
          ${liked ? "border-pink-400 text-pink-500" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
      >
        {liked ? "♥ Saved" : "♡ Save to My List"}
      </button>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} afterAuth={() => { setShowAuth(false); setLiked(true); }} />}
    </>
  );
}
