// app/product/[slug]/page.tsx
import { aggregatePrices } from "@/lib/price-aggregator";
import PriceTable from "@/components/PriceTable";
import ReviewSection from "@/components/ReviewSection";
import WishlistButton from "@/components/WishlistButton";

const PRODUCT_DATA: Record<string, { brand: string; name: string; meta: string; emoji: string; rating: number; reviewCount: number; query: string }> = {
  "beauty-of-joseon-relief-sun":  { brand: "Beauty of Joseon", name: "Relief Sun : Rice + Probiotics SPF50+ PA++++", meta: "Sunscreen · 50ml", emoji: "🌞", rating: 4.9, reviewCount: 1247, query: "Beauty of Joseon Relief Sun" },
  "ahc-eye-cream":                { brand: "AHC",              name: "Essential Real Eye Cream for Face 30ml",      meta: "Eye Cream · 30ml",  emoji: "👁️", rating: 4.8, reviewCount: 892,  query: "AHC eye cream" },
  "cosrx-snail-96-mucin":         { brand: "COSRX",            name: "Advanced Snail 96 Mucin Power Essence 100ml", meta: "Essence · 100ml",   emoji: "🐌", rating: 4.9, reviewCount: 3241, query: "COSRX snail mucin essence" },
  "joseon-matte-sun-stick":       { brand: "Beauty of Joseon", name: "Matte Sun Stick: Mugwort + Camellia 18g",    meta: "Sunscreen · 18g",   emoji: "☀️", rating: 4.7, reviewCount: 634,  query: "Beauty of Joseon matte sun stick" },
  "anua-heartleaf-toner":         { brand: "Anua",             name: "Heartleaf 77% Soothing Toner 250ml",         meta: "Toner · 250ml",     emoji: "💚", rating: 4.8, reviewCount: 521,  query: "Anua Heartleaf toner" },
  "skin1004-centella-ampoule":    { brand: "SKIN1004",         name: "Madagascar Centella Ampoule 100ml",          meta: "Ampoule · 100ml",   emoji: "🌿", rating: 4.7, reviewCount: 389,  query: "SKIN1004 centella ampoule" },
  "innisfree-green-tea-serum":    { brand: "Innisfree",        name: "Green Tea Seed Serum 80ml",                  meta: "Serum · 80ml",      emoji: "🍵", rating: 4.6, reviewCount: 782,  query: "Innisfree green tea serum" },
  "laneige-lip-sleeping-mask":    { brand: "Laneige",          name: "Lip Sleeping Mask Berry 20g",                meta: "Lip Care · 20g",    emoji: "🌸", rating: 4.9, reviewCount: 4102, query: "Laneige lip sleeping mask" },
};

interface Props { params: { slug: string } }

export default async function ProductPage({ params }: Props) {
  const product = PRODUCT_DATA[params.slug];

  if (!product) {
    return <div className="py-20 text-center text-gray-400">Product not found.</div>;
  }

  const priceData = await aggregatePrices(product.query);

  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));

  return (
    <div className="pt-8">
      {/* Product header */}
      <div className="flex gap-5 mb-8">
        <div className="w-36 h-36 bg-gray-50 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
          {product.emoji}
        </div>
        <div className="flex-1">
          <p className="label mb-1">{product.brand}</p>
          <h1 className="text-xl font-medium text-gray-900 mb-2 leading-snug">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-3">{product.meta}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-yellow-500 tracking-wide">{stars}</span>
            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs border border-green-300 text-green-700 rounded-full px-3 py-0.5 font-medium">
              ✓ Authorized retailers only
            </span>
            <WishlistButton slug={params.slug} />
          </div>
        </div>
      </div>

      {/* Best price banner */}
      {priceData.lowestPrice && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="label mb-0.5">Best price</p>
            <p className="text-2xl font-medium">{priceData.lowestPrice.priceDisplay}</p>
            <p className="text-sm text-gray-500">at {priceData.lowestPrice.retailer} · {priceData.lowestPrice.shipping}</p>
          </div>
          {priceData.savingsVsHighest > 0 && (
            <a
              href={priceData.lowestPrice.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-primary"
            >
              Buy now ↗
            </a>
          )}
        </div>
      )}

      {/* Price comparison */}
      <div className="mb-10">
        <PriceTable prices={priceData.prices} query={product.query} />
        <p className="text-[11px] text-gray-400 mt-3">
          * Prices updated {new Date(priceData.fetchedAt).toLocaleTimeString()}. Links earn Compario an affiliate commission at no extra cost to you.
        </p>
      </div>

      {/* Community reviews */}
      <ReviewSection productSlug={params.slug} />
    </div>
  );
}
