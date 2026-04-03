import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { splitId, settled } = body;

    const split = await prisma.expenseSplit.update({
      where: { id: splitId, expenseId: params.id },
      data: { settled },
      include: { member: true },
    });

    return NextResponse.json(split);
  } catch (error) {
    console.error("Failed to settle split:", error);
    return NextResponse.json(
      { error: "Failed to update settlement" },
      { status: 500 }
    );
  }
}
