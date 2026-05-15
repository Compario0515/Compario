// lib/retailers/others.ts
import type { RetailerPrice } from "./amazon";

// ─── Walmart Open API ──────────────────────────────────────────────────────
export async function fetchWalmartPrices(query: string): Promise<RetailerPrice[]> {
  if (!process.env.WALMART_CLIENT_ID) return getMockPrice("Walmart", query, 1.08);

  try {
    // Get OAuth token
    const tokenRes = await fetch("https://marketplace.walmartapis.com/v3/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.WALMART_CLIENT_ID}:${process.env.WALMART_CLIENT_SECRET}`).toString("base64")}`,
        "WM_SVC.NAME": "Walmart Marketplace",
        "WM_QOS.CORRELATION_ID": crypto.randomUUID(),
      },
      body: "grant_type=client_credentials",
      next: { revalidate: 3500 },
    });
    const { access_token } = await tokenRes.json();

    const searchRes = await fetch(
      `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=${encodeURIComponent(query)}&numItems=1`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "WM_SEC.ACCESS_TOKEN": access_token,
          "WM_SVC.NAME": "Walmart Marketplace",
          "WM_QOS.CORRELATION_ID": crypto.randomUUID(),
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    const data = await searchRes.json();
    const item = data.items?.[0];
    if (!item) return getMockPrice("Walmart", query, 1.08);

    return [{
      retailer: "Walmart",
      price: item.salePrice ?? item.msrp ?? null,
      priceDisplay: item.salePrice ? `$${item.salePrice.toFixed(2)}` : "—",
      shipping: item.freeShippingThreshold ? `Free over $${item.freeShippingThreshold}` : "$6.99 shipping",
      affiliateUrl: `https://goto.walmart.com/c/${process.env.WALMART_CLIENT_ID}/${encodeURIComponent(item.productUrl ?? "")}`,
      inStock: item.availableOnline ?? false,
      imageUrl: item.largeImage,
    }];
  } catch (e) {
    console.error("Walmart fetch error:", e);
    return getMockPrice("Walmart", query, 1.08);
  }
}

// ─── iHerb (product feed — updated daily) ─────────────────────────────────
export async function fetchIHerbPrices(query: string): Promise<RetailerPrice[]> {
  // iHerb provides a product feed CSV via their affiliate program.
  // In production, you download & index this daily. For now, we use mock.
  return getMockPrice("iHerb", query, 1.12);
}

// ─── YesStyle via ShareASale product feed ─────────────────────────────────
export async function fetchYesStylePrices(query: string): Promise<RetailerPrice[]> {
  return getMockPrice("YesStyle", query, 1.22);
}

// ─── Soko Glam via ShareASale product feed ────────────────────────────────
export async function fetchSokoGlamPrices(query: string): Promise<RetailerPrice[]> {
  return getMockPrice("Soko Glam", query, 1.30);
}

// ─── K-Beauty specialist retailers (updated manually/weekly) ─────────────
const KBEAUTY_RETAILERS = [
  { name: "StyleKorean", multiplier: 1.05, shipping: "$3.99 shipping",       tag: "style-korean" },
  { name: "Jolse",        multiplier: 1.07, shipping: "Free over $40",        tag: "jolse" },
  { name: "Stylevana",    multiplier: 1.10, shipping: "Free over $49",        tag: "stylevana" },
  { name: "Blooming KOCO",multiplier: 1.20, shipping: "$8 shipping",          tag: "bloomingkoco" },
  { name: "Olive Young",  multiplier: 1.35, shipping: "$4.99 shipping",       tag: "oliveyoung" },
];

export async function fetchKBeautyRetailerPrices(query: string): Promise<RetailerPrice[]> {
  return KBEAUTY_RETAILERS.map(r => getMockPrice(r.name, query, r.multiplier, r.shipping, r.tag)[0]);
}

// ─── Sephora & Ulta (Rakuten/Impact feed) ────────────────────────────────
export async function fetchSephoraPrices(query: string): Promise<RetailerPrice[]> {
  return getMockPrice("Sephora", query, 1.45, "Free over $25");
}
export async function fetchUltaPrices(query: string): Promise<RetailerPrice[]> {
  return getMockPrice("Ulta Beauty", query, 1.50, "Free over $35");
}

// ─── Helper: mock price based on Amazon baseline ──────────────────────────
const BASE_PRICES: Record<string, number> = {
  "relief sun": 9.70,
  "joseon sun": 9.70,
  "ahc eye": 17.50,
  "snail mucin": 14.80,
  "cosrx snail": 14.80,
  "laneige lip": 16.00,
  "some by mi": 12.50,
  "centella": 11.20,
  "skin1004": 11.20,
  "innisfree green tea": 21.00,
  "anua": 19.00,
  "heartleaf": 19.00,
};

function getBasePrice(query: string): number {
  const q = query.toLowerCase();
  const key = Object.keys(BASE_PRICES).find(k => q.includes(k));
  return key ? BASE_PRICES[key] : 14.99;
}

function getMockPrice(
  retailer: string,
  query: string,
  multiplier: number,
  shipping = "Varies",
  tag = "compario"
): RetailerPrice[] {
  const base = getBasePrice(query);
  const price = Math.round(base * multiplier * 100) / 100;
  const encodedQuery = encodeURIComponent(query);

  const urlMap: Record<string, string> = {
    "Walmart":       `https://www.walmart.com/search?q=${encodedQuery}`,
    "iHerb":         `https://www.iherb.com/search?kw=${encodedQuery}&rcode=${process.env.IHERB_AFFILIATE_ID ?? ""}`,
    "YesStyle":      `https://www.yesstyle.com/en/search.html?keyword=${encodedQuery}`,
    "Soko Glam":     `https://sokoglam.com/search?type=product&q=${encodedQuery}`,
    "Sephora":       `https://www.sephora.com/search?keyword=${encodedQuery}`,
    "Ulta Beauty":   `https://www.ulta.com/shop/skincare?search=${encodedQuery}`,
    "StyleKorean":   `https://www.stylekorean.com/search/?keywords=${encodedQuery}`,
    "Jolse":         `https://jolse.com/search/?q=${encodedQuery}`,
    "Stylevana":     `https://www.stylevana.com/en_US/search?q=${encodedQuery}`,
    "Blooming KOCO": `https://bloomingkoco.com/search?q=${encodedQuery}`,
    "Olive Young":   `https://www.oliveyoung.com/search?query=${encodedQuery}`,
  };

  return [{
    retailer,
    price,
    priceDisplay: `$${price.toFixed(2)}`,
    shipping,
    affiliateUrl: urlMap[retailer] ?? `https://www.google.com/search?q=${encodedQuery}+${retailer}`,
    inStock: true,
  }];
}
