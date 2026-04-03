import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const memberId = searchParams.get("memberId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (category && category !== "all") where.category = category;
    if (memberId && memberId !== "all") where.addedById = memberId;

    const [expenses, total] = await Promise.all([
      prisma.expenseItem.findMany({
        where,
        orderBy: { purchaseDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          addedBy: true,
          splits: { include: { member: true } },
        },
      }),
      prisma.expenseItem.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      itemName,
      quantity,
      quantityUnit,
      price,
      purchaseDate,
      notes,
      category,
      addedById,
      splitAmong,
    } = body;

    if (!itemName || !price || !addedById || !splitAmong?.length) {
      return NextResponse.json(
        { error: "Item name, price, added by, and split members are required" },
        { status: 400 }
      );
    }

    const totalAmount = (quantity || 1) * price;
    const splitAmount = totalAmount / splitAmong.length;

    const expense = await prisma.expenseItem.create({
      data: {
        itemName,
        quantity: quantity || 1,
        quantityUnit: quantityUnit || "pcs",
        price,
        totalAmount,
        purchaseDate: new Date(purchaseDate || Date.now()),
        notes,
        category: category || "General",
        addedById,
        splits: {
          create: splitAmong.map((memberId: string) => ({
            memberId,
            amount: splitAmount,
          })),
        },
      },
      include: {
        addedBy: true,
        splits: { include: { member: true } },
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Failed to create expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
