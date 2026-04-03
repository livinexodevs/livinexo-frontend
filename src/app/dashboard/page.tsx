"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  IndianRupee,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Receipt,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { AnalyticsData, ExpenseItem } from "@/types";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [analyticsRes, expensesRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/expenses?limit=5"),
      ]);
      const analyticsData = await analyticsRes.json();
      const expensesData = await expensesRes.json();
      setAnalytics(analyticsData);
      setRecentExpenses(expensesData.expenses || []);
    } catch {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-sand-200 rounded-xl animate-pulse" />
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 sm:p-6 h-24 sm:h-28 animate-pulse bg-sand-100" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 h-64 animate-pulse bg-sand-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
          Dashboard
        </h1>
        <p className="text-sand-500 text-sm mt-1">
          Overview of your household expenses
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spending"
          value={formatCurrency(analytics.totalExpenses)}
          icon={IndianRupee}
        />
        <StatCard
          title="Total Items"
          value={analytics.totalItems.toString()}
          subtitle="expenses logged"
          icon={ShoppingCart}
        />
        <StatCard
          title="Members"
          value={analytics.memberCount.toString()}
          subtitle="household members"
          icon={Users}
        />
        <StatCard
          title="Avg per Item"
          value={formatCurrency(analytics.avgExpensePerItem)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="font-semibold text-sand-900 text-sm sm:text-base">
              Recent Expenses
            </h2>
            <Link
              href="/expenses"
              className="text-xs sm:text-sm text-haveli-600 hover:text-haveli-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Receipt className="w-10 h-10 text-sand-300 mx-auto mb-3" />
              <p className="text-sm text-sand-500 mb-3">No expenses yet</p>
              <Link href="/expenses/new" className="btn-primary text-sm">
                <Plus className="w-4 h-4" /> Add First Expense
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-2.5 border-b border-sand-100 last:border-0 gap-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <Avatar name={expense.addedBy.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-sand-900 truncate">
                        {expense.itemName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-sand-500">
                        {formatDateTime(expense.purchaseDate)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-haveli-700 flex-shrink-0">
                    {formatCurrency(expense.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="font-semibold text-sand-900 text-sm sm:text-base">
              Member Spending
            </h2>
            <Link
              href="/analytics"
              className="text-xs sm:text-sm text-haveli-600 hover:text-haveli-700 font-medium flex items-center gap-1"
            >
              Full analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {analytics.memberSpending.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Users className="w-10 h-10 text-sand-300 mx-auto mb-3" />
              <p className="text-sm text-sand-500 mb-3">No members yet</p>
              <Link href="/members" className="btn-primary text-sm">
                <Plus className="w-4 h-4" /> Add Members
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.memberSpending.map((ms) => {
                const maxSpent = Math.max(
                  ...analytics.memberSpending.map((m) => m.spent),
                  1
                );
                return (
                  <div key={ms.name}>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={ms.name} size="sm" />
                        <span className="text-sm font-medium text-sand-800 truncate">
                          {ms.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-sand-700 flex-shrink-0">
                        {formatCurrency(ms.spent)}
                      </span>
                    </div>
                    <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-haveli-400 to-haveli-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${(ms.spent / maxSpent) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {analytics.topItems.length > 0 && (
        <div className="card p-4 sm:p-6">
          <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
            Most Purchased Items
          </h2>
          <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.topItems.slice(0, 4).map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 border border-sand-100"
              >
                <span className="text-base sm:text-lg font-bold text-haveli-600 w-7 sm:w-8 flex-shrink-0">
                  #{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-sand-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-sand-500">
                    {item.count}× · {formatCurrency(item.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
