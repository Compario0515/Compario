// app/my-list/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";

interface WishItem { id: string; product: { slug: string; name: string; brand: string } }
interface MyReview { id: string; rating: number; body: string; hearts: number; product: { slug: string; name: string } }

export default function MyListPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"saved" | "reviews">("saved");
  const [items, setItems] = useState<WishItem[]>([]);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!session) return;
    if (tab === "saved") {
      fetch("/api/wishlist").then(r => r.json()).then(d => setItems(d.items ?? []));
    } else {
      fetch("/api/reviews/mine").then(r => r.json()).then(d => setReviews(d.reviews ?? []));
    }
  }, [session, tab]);

  if (status === "loading") return <div className="py-20 text-center text-gray-400">Loading…</div>;

  if (!session) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium mb-2">Sign in to view your list</p>
        <p className="text-sm text-gray-500 mb-6">Save products and reviews to access them anywhere.</p>
        <button onClick={() => setShowAuth(true)} className="btn-primary">Sign In</button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium mb-1">My List</h1>
        <p className="text-sm text-gray-400">Your saved products and reviews</p>
      </div>

      <div className="flex gap-0 border-b border-gray-100 mb-6">
        {(["saved", "reviews"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wide border-b-2 -mb-px transition-colors
              ${tab === t ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            {t === "saved" ? "Saved Products" : "My Reviews"}
          </button>
        ))}
      </div>

      {tab === "saved" && (
        items.length === 0
          ? <p className="text-sm text-gray-400 text-center py-12">No saved products yet. Tap ♡ on any product to save it.</p>
          : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map(item => (
                <Link key={item.id} href={`/product/${item.product.slug}`} className="card p-4 hover:border-gray-200 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{item.product.brand}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                </Link>
              ))}
            </div>
      )}

      {tab === "reviews" && (
        reviews.length === 0
          ? <p className="text-sm text-gray-400 text-center py-12">No reviews yet. Visit a product page to write one.</p>
          : <div className="flex flex-col gap-3">
              {reviews.map(r => (
                <Link key={r.id} href={`/product/${r.product.slug}`} className="card p-4 hover:border-gray-200 transition-colors block">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{r.product.name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{r.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-yellow-400">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                    <span className="text-xs text-pink-400">♥ {r.hearts}</span>
                  </div>
                </Link>
              ))}
            </div>
      )}
    </div>
  );
}
