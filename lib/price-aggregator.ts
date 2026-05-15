// lib/price-aggregator.ts
import { fetchAmazonPrices, type RetailerPrice } from "./retailers/amazon";
import {
  fetchWalmartPrices,
  fetchIHerbPrices,
  fetchYesStylePrices,
  fetchSokoGlamPrices,
  fetchKBeautyRetailerPrices,
  fetchSephoraPrices,
  fetchUltaPrices,
} from "./retailers/others";

export type { RetailerPrice };

export interface AggregatedPrices {
  query: string;
  fetchedAt: string;
  prices: RetailerPrice[];
  lowestPrice: RetailerPrice | null;
  savingsVsHighest: number;
}

export async function aggregatePrices(query: string): Promise<AggregatedPrices> {
  // Fetch all retailers in parallel — fastest possible
  const results = await Promise.allSettled([
    fetchAmazonPrices(query),
    fetchWalmartPrices(query),
    fetchIHerbPrices(query),
    fetchYesStylePrices(query),
    fetchSokoGlamPrices(query),
    fetchKBeautyRetailerPrices(query),
    fetchSephoraPrices(query),
    fetchUltaPrices(query),
  ]);

  const prices: RetailerPrice[] = results
    .flatMap(r => (r.status === "fulfilled" ? r.value : []))
    .filter(p => p.inStock && p.price !== null)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

  const lowestPrice = prices[0] ?? null;
  const highestPrice = prices[prices.length - 1]?.price ?? 0;
  const savingsVsHighest = lowestPrice
    ? Math.round((highestPrice - (lowestPrice.price ?? 0)) * 100) / 100
    : 0;

  return {
    query,
    fetchedAt: new Date().toISOString(),
    prices,
    lowestPrice,
    savingsVsHighest,
  };
}
