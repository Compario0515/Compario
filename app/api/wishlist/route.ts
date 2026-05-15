// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productSlug } = await req.json();
  let product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) {
    product = await prisma.product.create({
      data: { slug: productSlug, name: productSlug, brand: "Unknown", category: "skincare" },
    });
  }

  await prisma.wishlist.upsert({
    where: { userId_productId: { userId, productId: product.id } },
    create: { userId, productId: product.id },
    update: {},
  });
  return NextResponse.json({ saved: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productSlug } = await req.json();
  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return NextResponse.json({ removed: true });

  await prisma.wishlist.deleteMany({ where: { userId, productId: product.id } });
  return NextResponse.json({ removed: true });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ items: [] });

  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}
