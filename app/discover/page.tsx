// app/discover/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

const CATS = ["Sunscreen", "Toner", "Serum", "Eye Cream", "Cleanser", "Mask"] as const;
type Cat = typeof CATS[number];

const TRENDS: Record<Cat, { emoji: string; brand: string; name: string; slug: string; price: string; hot: boolean }[]> = {
  Sunscreen: [
    { emoji:"🌞", brand:"Beauty of Joseon", name:"Relief Sun Rice+Probiotics", slug:"beauty-of-joseon-relief-sun",  price:"from $9.70",  hot:true  },
    { emoji:"☀️", brand:"Beauty of Joseon", name:"Matte Sun Stick",            slug:"joseon-matte-sun-stick",       price:"from $12.00", hot:false },
    { emoji:"🛡️", brand:"COSRX",            name:"All Day Comfort Sunscreen",  slug:"cosrx-snail-96-mucin",         price:"from $13.50", hot:true  },
    { emoji:"🌤️", brand:"Some By Mi",       name:"Platinum Tone Up Sunscreen", slug:"anua-heartleaf-toner",         price:"from $11.80", hot:false },
  ],
  Toner: [
    { emoji:"💧", brand:"Some By Mi",  name:"AHA BHA PHA 30 Days Toner",    slug:"anua-heartleaf-toner",     price:"from $12.50", hot:true  },
    { emoji:"💚", brand:"Anua",        name:"Heartleaf 77% Soothing Toner", slug:"anua-heartleaf-toner",     price:"from $19.00", hot:true  },
    { emoji:"🌸", brand:"Pyunkang Yul",name:"Essence Toner",                slug:"anua-heartleaf-toner",     price:"from $15.00", hot:false },
    { emoji:"🍵", brand:"Beauty of Joseon",name:"Green Tea Calming Toner",  slug:"beauty-of-joseon-relief-sun",price:"from $13.00",hot:false},
  ],
  Serum: [
    { emoji:"🐌", brand:"COSRX",        name:"Snail 96 Mucin Essence",    slug:"cosrx-snail-96-mucin",      price:"from $14.80", hot:true  },
    { emoji:"💎", brand:"Beauty of Joseon",name:"Revive Ginseng Essence", slug:"beauty-of-joseon-relief-sun",price:"from $16.00",hot:false},
    { emoji:"🌿", brand:"SKIN1004",     name:"Centella Ampoule",          slug:"skin1004-centella-ampoule", price:"from $11.20", hot:true  },
    { emoji:"✨", brand:"Some By Mi",   name:"Galactomyces Vitamin C",    slug:"anua-heartleaf-toner",      price:"from $18.00", hot:false },
  ],
  "Eye Cream": [
    { emoji:"👁️", brand:"AHC",       name:"Essential Real Eye Cream",  slug:"ahc-eye-cream",            price:"from $17.50", hot:true  },
    { emoji:"🌙", brand:"Laneige",   name:"Water Sleeping Eye Mask",   slug:"laneige-lip-sleeping-mask",price:"from $19.00", hot:false },
    { emoji:"💫", brand:"Benton",    name:"Fermentation Eye Cream",    slug:"ahc-eye-cream",            price:"from $14.00", hot:true  },
    { emoji:"🌿", brand:"Innisfree", name:"Green Tea Eye Cream",       slug:"innisfree-green-tea-serum",price:"from $13.50", hot:false },
  ],
  Cleanser: [
    { emoji:"🫧", brand:"COSRX",          name:"Salicylic Acid Daily Cleanser",  slug:"cosrx-snail-96-mucin",        price:"from $10.50", hot:true  },
    { emoji:"🌸", brand:"Beauty of Joseon",name:"Radiance Cleansing Balm",       slug:"beauty-of-joseon-relief-sun", price:"from $14.00", hot:false },
    { emoji:"🌊", brand:"Heimish",        name:"All Clean Balm",                 slug:"cosrx-snail-96-mucin",        price:"from $12.50", hot:true  },
    { emoji:"🍋", brand:"Some By Mi",     name:"Galactomyces Cleanser",          slug:"anua-heartleaf-toner",        price:"from $11.00", hot:false },
  ],
  Mask: [
    { emoji:"🌸", brand:"Laneige",   name:"Lip Sleeping Mask Berry",    slug:"laneige-lip-sleeping-mask",price:"from $16.00", hot:true  },
    { emoji:"🌿", brand:"Innisfree", name:"Super Volcanic Pore Clay",   slug:"innisfree-green-tea-serum",price:"from $13.00", hot:false },
    { emoji:"🎭", brand:"Some By Mi",name:"AHA BHA PHA Miracle Mask",   slug:"anua-heartleaf-toner",     price:"from $12.00", hot:true  },
    { emoji:"🍯", brand:"Mediheal",  name:"NMF Aquaring Ampoule Mask",  slug:"laneige-lip-sleeping-mask",price:"from $18.00", hot:false },
  ],
};

export default function DiscoverPage() {
  const [cat, setCat] = useState<Cat>("Sunscreen");
  const items = TRENDS[cat];

  return (
    <div className="pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium mb-1">Discover K-Beauty</h1>
        <p className="text-sm text-gray-400">What&apos;s trending in the U.S. right now</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${cat === c ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <Link key={i} href={`/product/${item.slug}`} className="card hover:border-gray-200 transition-colors block">
            <div className="aspect-square bg-gray-50 rounded-t-xl flex items-center justify-center text-4xl">{item.emoji}</div>
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">#{i+1} in {cat}</p>
              <p className="text-[10px] text-gray-400 mb-1">{item.brand}</p>
              <p className="text-xs font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</p>
              <p className="text-xs text-gray-500">{item.price}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${item.hot ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
                {item.hot ? "Trending" : "Popular"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
