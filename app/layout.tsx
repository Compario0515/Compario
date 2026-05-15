// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compario — Find the best K-Beauty prices",
  description:
    "Compare K-Beauty prices across 13 authorized US retailers instantly. Authentic products, lowest price guaranteed.",
  openGraph: {
    title: "Compario",
    description: "K-Beauty price comparison — 13 authorized retailers",
    siteName: "Compario",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 pb-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
