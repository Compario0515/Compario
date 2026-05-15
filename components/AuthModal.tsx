"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface Props { onClose: () => void; afterAuth?: () => void; }

export default function AuthModal({ onClose, afterAuth }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: window.location.href });
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const res = await signIn("credentials", {
      email, password, name, mode, redirect: false,
    });
    setLoading(false);
    if (res?.error) { setError("Invalid credentials. Please try again."); return; }
    afterAuth?.();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-gray-900 text-xl leading-none">&times;</button>

        <p className="text-center text-[11px] tracking-[2px] uppercase text-gray-400 mb-4">Compario</p>
        <h2 className="text-center text-xl font-medium mb-1">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          {mode === "signin"
            ? "Sign in to save products and reviews"
            : "Join to save products and get the best deals"}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:border-gray-400 transition-colors mb-3"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400 uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          {mode === "signup" && (
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-900"
            type="password"
            placeholder={mode === "signup" ? "Password (min. 6 characters)" : "Password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "signin" ? "No account? " : "Already have one? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            className="text-gray-900 font-medium underline underline-offset-2"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        {mode === "signup" && (
          <p className="text-center text-[11px] text-gray-400 mt-4">
            By creating an account you agree to our Terms & Privacy Policy.
          </p>
        )}
      </div>
    </div>
  );
}
