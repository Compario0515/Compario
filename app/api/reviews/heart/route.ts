// app/api/reviews/heart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId } = await req.json();
  const existing = await prisma.reviewHeart.findUnique({ where: { reviewId_userId: { reviewId, userId } } });

  if (existing) {
    await prisma.reviewHeart.delete({ where: { reviewId_userId: { reviewId, userId } } });
    const review = await prisma.review.update({ where: { id: reviewId }, data: { hearts: { decrement: 1 } } });
    return NextResponse.json({ hearted: false, hearts: review.hearts });
  } else {
    await prisma.reviewHeart.create({ data: { reviewId, userId } });
    const review = await prisma.review.update({ where: { id: reviewId }, data: { hearts: { increment: 1 } } });
    return NextResponse.json({ hearted: true, hearts: review.hearts });
  }
}
