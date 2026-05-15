"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";

interface Review {
  id: string;
  rating: number;
  body: string;
  hearts: number;
  hearted: boolean;
  createdAt: string;
  user: { name: string | null };
}

export default function ReviewSection({ productSlug }: { productSlug: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?slug=${productSlug}`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []));
  }, [productSlug]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { setShowAuth(true); return; }
    if (!rating || !body.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug, rating, body }),
    });
    if (res.ok) {
      const newReview = await res.json();
      setReviews(prev => [newReview, ...prev]);
      setBody(""); setRating(0);
    }
    setSubmitting(false);
  }

  async function toggleHeart(reviewId: string) {
    if (!session) { setShowAuth(true); return; }
    const res = await fetch("/api/reviews/heart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId }),
    });
    if (res.ok) {
      const { hearted, hearts } = await res.json();
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, hearted, hearts } : r));
    }
  }

  return (
    <div>
      <p className="label mb-4">Community Reviews & Discussion</p>

      {/* Write a review */}
      {session ? (
        <form onSubmit={submitReview} className="card p-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your rating</p>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                className={`text-xl transition-colors ${n <= (hovered || rating) ? "text-yellow-400" : "text-gray-200"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="w-full border border-gray-100 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-gray-300 bg-gray-50"
            rows={3}
            placeholder="Share your experience — price, quality, authenticity, shipping…"
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <button type="submit" disabled={submitting || !rating || !body.trim()} className="btn-primary mt-3 text-xs px-4 py-1.5 disabled:opacity-40">
            {submitting ? "Posting…" : "Post Review"}
          </button>
        </form>
      ) : (
        <div className="card p-6 text-center mb-6">
          <p className="text-sm text-gray-500 mb-3">Sign in to leave a review or join the discussion</p>
          <button onClick={() => setShowAuth(true)} className="btn-primary text-sm">
            Sign In
          </button>
        </div>
      )}

      {/* Review list */}
      <div className="flex flex-col gap-1">
        {reviews.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
        )}
        {reviews.map(r => (
          <div key={r.id} className="py-4 border-b border-gray-50 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{r.user.name ?? "User"}</span>
                <span className="text-xs text-yellow-400">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.body}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleHeart(r.id)}
                className={`text-sm flex items-center gap-1 transition-colors ${r.hearted ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}`}
              >
                {r.hearted ? "♥" : "♡"} {r.hearts}
              </button>
              <button className="text-xs text-gray-300 hover:text-gray-500">Report</button>
            </div>
          </div>
        ))}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
