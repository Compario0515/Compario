// lib/retailers/amazon.ts
// Fetches real-time prices from Amazon Product Advertising API 5.0

const PA_API_URL = "https://webservices.amazon.com/paapi5/searchitems";

interface AmazonItem {
  ASIN: string;
  DetailPageURL: string;
  ItemInfo?: { Title?: { DisplayValue?: string } };
  Offers?: {
    Listings?: Array<{
      Price?: { DisplayAmount?: string; Amount?: number };
      DeliveryInfo?: { IsPrimeEligible?: boolean };
    }>;
  };
  Images?: {
    Primary?: { Large?: { URL?: string } };
  };
}

export interface RetailerPrice {
  retailer: string;
  price: number | null;
  priceDisplay: string;
  shipping: string;
  affiliateUrl: string;
  inStock: boolean;
  imageUrl?: string;
}

// Lightweight HMAC-SHA256 signer for PA-API
async function signRequest(body: string, date: string): Promise<string> {
  const accessKey = process.env.AMAZON_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_SECRET_KEY!;
  const region = process.env.AMAZON_REGION ?? "us-east-1";
  const service = "ProductAdvertisingAPI";
  const host = "webservices.amazon.com";
  const path = "/paapi5/searchitems";

  const enc = new TextEncoder();
  const dateShort = date.slice(0, 8);

  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${date}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`;
  const signedHeaders = "content-type;host;x-amz-date;x-amz-target";
  const payloadHash = await sha256hex(enc.encode(body));
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateShort}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${credentialScope}\n${await sha256hex(enc.encode(canonicalRequest))}`;

  const signingKey = await deriveKey(enc.encode(`AWS4${secretKey}`), dateShort, region, service);
  const signature = await hmacHex(signingKey, enc.encode(stringToSign));

  return `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

async function sha256hex(data: BufferSource): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(key: CryptoKey, data: BufferSource): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", key, data);
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function deriveKey(seed: BufferSource, date: string, region: string, service: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const importKey = (raw: BufferSource) =>
    crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sign = async (key: CryptoKey, msg: string) =>
    crypto.subtle.sign("HMAC", key, enc.encode(msg));

  const k1 = await importKey(seed);
  const k2 = await importKey(await sign(k1, date));
  const k3 = await importKey(await sign(k2, region));
  const k4 = await importKey(await sign(k3, service));
  return importKey(await sign(k4, "aws4_request"));
}

export async function fetchAmazonPrices(query: string): Promise<RetailerPrice[]> {
  if (!process.env.AMAZON_ACCESS_KEY) {
    return getMockAmazonPrices(query);
  }

  try {
    const body = JSON.stringify({
      Keywords: query,
      Resources: [
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.DeliveryInfo.IsPrimeEligible",
        "Images.Primary.Large",
      ],
      SearchIndex: "BeautyHealth",
      PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
    });

    const now = new Date();
    const date = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const auth = await signRequest(body, date);

    const res = await fetch(PA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Date": date,
        "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
        Authorization: auth,
        Host: "webservices.amazon.com",
      },
      body,
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) throw new Error(`Amazon API ${res.status}`);
    const data = await res.json();
    const items: AmazonItem[] = data.SearchResult?.Items ?? [];

    return items.slice(0, 1).map(item => {
      const listing = item.Offers?.Listings?.[0];
      const price = listing?.Price?.Amount ?? null;
      return {
        retailer: "Amazon",
        price,
        priceDisplay: listing?.Price?.DisplayAmount ?? "—",
        shipping: listing?.DeliveryInfo?.IsPrimeEligible ? "Free (Prime)" : "Varies",
        affiliateUrl: item.DetailPageURL,
        inStock: !!listing,
        imageUrl: item.Images?.Primary?.Large?.URL,
      };
    });
  } catch (e) {
    console.error("Amazon fetch error:", e);
    return getMockAmazonPrices(query);
  }
}

// Fallback mock data when API keys are not yet configured
function getMockAmazonPrices(query: string): RetailerPrice[] {
  const prices: Record<string, number> = {
    "relief sun": 9.70,
    "ahc eye cream": 18.90,
    "cosrx snail": 14.80,
    "laneige lip": 16.50,
  };
  const key = Object.keys(prices).find(k => query.toLowerCase().includes(k));
  const price = key ? prices[key] : 12.99;
  return [{
    retailer: "Amazon",
    price,
    priceDisplay: `$${price.toFixed(2)}`,
    shipping: "Free (Prime)",
    affiliateUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${process.env.AMAZON_ASSOCIATE_TAG ?? "compario-20"}`,
    inStock: true,
    imageUrl: undefined,
  }];
}
