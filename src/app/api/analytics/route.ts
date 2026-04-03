import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format, subMonths, startOfMonth } from "date-fns";

export async function GET() {
  try {
    const [allExpenses, members, splits] = await Promise.all([
      prisma.expenseItem.findMany({
        include: { addedBy: true, splits: { include: { member: true } } },
        orderBy: { purchaseDate: "desc" },
      }),
      prisma.member.findMany(),
      prisma.expenseSplit.findMany({ include: { member: true, expense: true } }),
    ]);

    const totalExpenses = allExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalItems = allExpenses.length;
    const memberCount = members.length;
    const avgExpensePerItem = totalItems > 0 ? totalExpenses / totalItems : 0;

    const itemCounts: Record<string, { count: number; total: number }> = {};
    for (const expense of allExpenses) {
      const name = expense.itemName;
      if (!itemCounts[name]) itemCounts[name] = { count: 0, total: 0 };
      itemCounts[name].count += 1;
      itemCounts[name].total += expense.totalAmount;
    }

    const topItems = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const highestSpending = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, total: data.total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    const memberSpending = members.map((member) => {
      const addedExpenses = allExpenses.filter((e) => e.addedById === member.id);
      const spent = addedExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
      const memberSplits = splits.filter((s) => s.memberId === member.id);
      const owed = memberSplits.reduce((sum, s) => sum + s.amount, 0);
      return { name: member.name, spent, owed };
    });

    const now = new Date();
    const monthlyTrend: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = startOfMonth(subMonths(now, i - 1));
      const monthExpenses = allExpenses.filter((e) => {
        const d = new Date(e.purchaseDate);
        return d >= monthStart && d < monthEnd;
      });
      const total = monthExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
      monthlyTrend.push({ month: format(monthStart, "MMM yyyy"), total });
    }

    const categoryBreakdown: Record<string, number> = {};
    for (const expense of allExpenses) {
      const cat = expense.category;
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + expense.totalAmount;
    }
    const categoryData = Object.entries(categoryBreakdown)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      totalExpenses,
      totalItems,
      memberCount,
      avgExpensePerItem,
      topItems,
      highestSpending,
      memberSpending,
      monthlyTrend,
      categoryBreakdown: categoryData,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
