"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      <header className="border-b border-gray-100">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-[13px] font-medium tracking-[2px] uppercase">
            Compario
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/discover" className="text-[12px] text-gray-500 hover:text-gray-900 uppercase tracking-wide font-medium">
              Discover
            </Link>

            {session ? (
              <>
                <Link href="/my-list" className="text-[12px] text-gray-500 hover:text-gray-900 uppercase tracking-wide font-medium">
                  My List
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center"
                  title={session.user?.name ?? "Account"}
                >
                  {initials}
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuth(true)} className="btn-outline text-[12px] px-4 py-1.5">
                Sign In
              </button>
            )}
          </div>
        </nav>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
