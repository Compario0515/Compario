"use client";
import { useState } from "react";
import type { RetailerPrice } from "@/lib/price-aggregator";

interface Props { prices: RetailerPrice[]; query: string; }

export default function PriceTable({ prices, query }: Props) {
  const [showAll, setShowAll] = useState(false);
  const top3 = prices.slice(0, 3);
  const rest = prices.slice(3);

  function Row({ item, rank }: { item: RetailerPrice; rank: number }) {
    const isBest = rank === 1;
    return (
      <div className={`flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-0 ${isBest ? "bg-gray-50 -mx-4 px-4 rounded-xl" : ""}`}>
        <span className={`text-sm font-medium w-6 text-center flex-shrink-0 ${isBest ? "text-gray-900" : "text-gray-400"}`}>
          #{rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{item.retailer}</span>
            {isBest && (
              <span className="text-[10px] font-medium bg-gray-900 text-white px-2 py-0.5 rounded-full">
                Best price
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{item.shipping}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-base font-medium ${item.price === null ? "text-gray-400 italic text-sm" : "text-gray-900"}`}>
            {item.priceDisplay}
          </span>
          {item.inStock && item.price !== null && (
            <div>
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-xs text-gray-400 hover:text-gray-900 inline-flex items-center gap-0.5 mt-0.5"
              >
                Shop now ↗
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="label mb-3">Price comparison — 13 authorized retailers</p>
      <div className="card p-4">
        {top3.map((item, i) => <Row key={item.retailer} item={item} rank={i + 1} />)}

        {rest.length > 0 && (
          <>
            {showAll && rest.map((item, i) => <Row key={item.retailer} item={item} rank={i + 4} />)}
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 py-2.5 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-colors font-medium"
            >
              {showAll ? "− Hide" : `+ Show ${rest.length} more retailers`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
