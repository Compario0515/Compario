// app/api/reviews/mine/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ reviews: [] });

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { product: { select: { slug: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}
