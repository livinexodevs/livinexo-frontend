"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { SpendingChart } from "@/components/charts/spending-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import { MemberChart } from "@/components/charts/member-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import type { AnalyticsData } from "@/types";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {
      console.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-sand-200 rounded-xl animate-pulse" />
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4 sm:p-6 h-24 sm:h-28 animate-pulse bg-sand-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalItems === 0) {
    return (
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-sand-900 mb-2">
          Analytics
        </h1>
        <EmptyState
          icon={PieChart}
          title="No data yet"
          description="Analytics will appear once you start adding expenses."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
          Analytics
        </h1>
        <p className="text-sand-500 text-sm mt-1">
          Insights into your household spending
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
          icon={ShoppingCart}
        />
        <StatCard
          title="Active Members"
          value={analytics.memberCount.toString()}
          icon={Users}
        />
        <StatCard
          title="Avg per Item"
          value={formatCurrency(analytics.avgExpensePerItem)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-4 sm:p-6 overflow-hidden">
          <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
            Monthly Trend
          </h2>
          <SpendingChart data={analytics.monthlyTrend} />
        </div>

        <div className="card p-4 sm:p-6 overflow-hidden">
          <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
            Spending by Category
          </h2>
          <CategoryChart data={analytics.categoryBreakdown} />
        </div>
      </div>

      <div className="card p-4 sm:p-6 overflow-hidden">
        <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
          Member Spending Comparison
        </h2>
        <MemberChart data={analytics.memberSpending} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-4 sm:p-6">
          <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
            Most Purchased Items
          </h2>
          <div className="space-y-1">
            {analytics.topItems.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2.5 border-b border-sand-100 last:border-0 gap-3"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className="text-sm font-bold text-haveli-600 w-5 sm:w-6 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-sand-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-sand-500">
                      {item.count} time{item.count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-sand-700 flex-shrink-0">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="font-semibold text-sand-900 mb-4 text-sm sm:text-base">
            Highest Spending Items
          </h2>
          <div className="space-y-3">
            {analytics.highestSpending.map((item, i) => {
              const maxTotal = analytics.highestSpending[0]?.total || 1;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-haveli-600 w-5 sm:w-6 flex-shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-medium text-sand-800 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-sand-700 flex-shrink-0">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="h-2 bg-sand-100 rounded-full overflow-hidden ml-7 sm:ml-8">
                    <div
                      className="h-full bg-gradient-to-r from-haveli-400 to-haveli-600 rounded-full transition-all duration-700"
                      style={{
                        width: `${(item.total / maxTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
