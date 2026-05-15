import Link from "next/link";
import ProductCard from "./ProductCard";

const TRENDING_PRODUCTS = [
  { slug: "beauty-of-joseon-relief-sun", brand: "Beauty of Joseon", name: "Relief Sun : Rice + Probiotics", priceFrom: 9.70, priceTo: 15.50, retailers: 11, emoji: "🌞" },
  { slug: "cosrx-snail-96-mucin",        brand: "COSRX",            name: "Advanced Snail 96 Mucin Power Essence", priceFrom: 14.50, priceTo: 25.00, retailers: 12, emoji: "🐌" },
  { slug: "anua-heartleaf-toner",        brand: "Anua",             name: "Heartleaf 77% Soothing Toner", priceFrom: 19.00, priceTo: 23.00, retailers: 9, emoji: "💚" },
  { slug: "skin1004-centella-ampoule",   brand: "SKIN1004",         name: "Madagascar Centella Ampoule", priceFrom: 11.20, priceTo: 16.50, retailers: 10, emoji: "🌿" },
];

const BEST_VALUE = [
  { slug: "ahc-eye-cream",                brand: "AHC",      name: "Essential Real Eye Cream for Face", priceFrom: 17.50, priceTo: 26.00, retailers: 12, emoji: "👁️" },
  { slug: "joseon-matte-sun-stick",       brand: "Beauty of Joseon", name: "Matte Sun Stick: Mugwort + Camellia", priceFrom: 12.00, priceTo: 20.00, retailers: 8, emoji: "☀️" },
  { slug: "innisfree-green-tea-serum",    brand: "Innisfree", name: "Green Tea Seed Serum", priceFrom: 21.00, priceTo: 31.00, retailers: 7, emoji: "🍵" },
  { slug: "laneige-lip-sleeping-mask",    brand: "Laneige",  name: "Lip Sleeping Mask Berry", priceFrom: 16.00, priceTo: 22.00, retailers: 11, emoji: "🌸" },
];

export default function TrendingSection() {
  return (
    <div>
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="label mb-1">Trending now</p>
            <h2 className="text-lg font-medium">Top Searched Products</h2>
          </div>
          <Link href="/search?q=k-beauty" className="text-[11px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-0.5 hover:text-gray-900 hover:border-gray-900 transition-colors">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRENDING_PRODUCTS.map(p => <ProductCard key={p.slug} {...p} />)}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4">
          <p className="label mb-1">Editor&apos;s pick</p>
          <h2 className="text-lg font-medium">Best Value Right Now</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BEST_VALUE.map(p => <ProductCard key={p.slug} {...p} />)}
        </div>
      </section>
    </div>
  );
}
