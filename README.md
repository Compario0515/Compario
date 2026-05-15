# Compario — K-Beauty Price Comparison

## Deploy in 4 steps (no coding needed)

### Step 1 — Set up the database (Supabase · free)
1. Go to **supabase.com** → New project
2. Copy the **Database URL** from Settings → Database → Connection string (URI)
3. Paste it as `DATABASE_URL` in your environment variables (see Step 3)

### Step 2 — Set up Google Login
1. Go to **console.cloud.google.com**
2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client
3. Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`
4. Copy **Client ID** and **Client Secret**

### Step 3 — Deploy to Vercel (free)
1. Go to **github.com** → New repository → Upload this entire folder
2. Go to **vercel.com** → Import your GitHub repo
3. In Vercel → Settings → Environment Variables, add:

```
DATABASE_URL         = (from Supabase)
NEXTAUTH_URL         = https://your-project.vercel.app
NEXTAUTH_SECRET      = (run: openssl rand -base64 32)
GOOGLE_CLIENT_ID     = (from Google Console)
GOOGLE_CLIENT_SECRET = (from Google Console)
```

4. Click **Deploy** — your site is live in ~2 minutes!

### Step 4 — Set up the database tables
In Vercel → your project → Functions tab → open terminal, run:
```
npx prisma db push
```
This creates all the tables automatically.

---

## Add Amazon prices (when you're ready)
1. Join **associates.amazon.com**
2. After approval, go to Tools → Product Advertising API → apply
3. Add to Vercel environment variables:
```
AMAZON_ACCESS_KEY    = (from Amazon)
AMAZON_SECRET_KEY    = (from Amazon)
AMAZON_ASSOCIATE_TAG = yourname-20
```
4. Redeploy — Amazon prices will now be live and real-time

## Add Walmart prices
1. Join **developer.walmart.com**
2. Add `WALMART_CLIENT_ID` and `WALMART_CLIENT_SECRET` to Vercel
3. Redeploy

## Monthly costs
| Service  | Cost       |
|----------|-----------|
| Vercel   | Free       |
| Supabase | Free (up to 500MB) |
| Domain   | ~$12/year  |
| **Total**| **~$1/month** |

---
Built with Next.js 14 · Tailwind CSS · Prisma · Supabase · NextAuth
