// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ reviews: [] });

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ reviews: [] });

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: {
      user: { select: { name: true } },
      heartedBy: userId ? { where: { userId } } : false,
    },
    orderBy: { hearts: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map(r => ({
      ...r,
      hearted: userId ? r.heartedBy.length > 0 : false,
      heartedBy: undefined,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productSlug, rating, body } = await req.json();
  if (!productSlug || !rating || !body?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) {
    product = await prisma.product.create({
      data: { slug: productSlug, name: productSlug, brand: "Unknown", category: "skincare" },
    });
  }

  const review = await prisma.review.create({
    data: { productId: product.id, userId, rating, body: body.trim() },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json({ ...review, hearted: false });
}
