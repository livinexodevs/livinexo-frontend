import { searchHouseholdItems } from "@/lib/household-items";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (query.length < 1) {
      return NextResponse.json([]);
    }

    const [historyItems, curatedMatches] = await Promise.all([
      prisma.expenseItem.findMany({
        where: { itemName: { contains: query } },
        select: {
          itemName: true,
          category: true,
          price: true,
          quantityUnit: true,
        },
        distinct: ["itemName"],
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      Promise.resolve(searchHouseholdItems(query)),
    ]);

    const seen = new Set<string>();
    const results: {
      name: string;
      category: string;
      unit: string;
      defaultPrice?: number;
      source: "history" | "suggested";
    }[] = [];

    for (const item of historyItems) {
      const key = item.itemName.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          name: item.itemName,
          category: item.category,
          unit: item.quantityUnit,
          defaultPrice: item.price,
          source: "history",
        });
      }
    }

    for (const item of curatedMatches) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          name: item.name,
          category: item.category,
          unit: item.unit,
          defaultPrice: item.defaultPrice,
          source: "suggested",
        });
      }
    }

    return NextResponse.json(results.slice(0, 8));
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json([], { status: 200 });
  }
}
