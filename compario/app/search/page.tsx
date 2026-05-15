// app/search/page.tsx
import { aggregatePrices } from "@/lib/price-aggregator";
import PriceTable from "@/components/PriceTable";
import Link from "next/link";

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q ?? "";

  if (!query) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p className="text-lg">Enter a product name to compare prices.</p>
      </div>
    );
  }

  const data = await aggregatePrices(query);

  return (
    <div className="pt-8">
      <div className="mb-6">
        <p className="label mb-1">Search results</p>
        <h1 className="text-xl font-medium text-gray-900">
          &ldquo;{query}&rdquo;
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {data.prices.length} retailers compared · prices updated {new Date(data.fetchedAt).toLocaleTimeString()}
        </p>
      </div>

      {data.lowestPrice && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="label mb-1">Best price found</p>
            <p className="text-2xl font-medium text-gray-900">{data.lowestPrice.priceDisplay}</p>
            <p className="text-sm text-gray-500 mt-0.5">at {data.lowestPrice.retailer} · {data.lowestPrice.shipping}</p>
          </div>
          {data.savingsVsHighest > 0 && (
            <div className="text-right">
              <p className="label mb-1">You save vs. highest</p>
              <p className="text-2xl font-medium text-green-700">${data.savingsVsHighest.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      <PriceTable prices={data.prices} query={query} />

      <p className="text-[11px] text-gray-400 mt-6">
        * Links earn Compario an affiliate commission at no extra cost to you. We only link to authorized retailers.
      </p>
    </div>
  );
}
