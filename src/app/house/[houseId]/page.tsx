"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  IndianRupee,
  Plus,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  getAnalytics,
  getHouseById,
  getSavedSession,
  listExpenses,
  type ExpenseSummary,
  type HouseResponse,
} from "@/lib/onboarding";

interface HouseLandingPageProps {
  params: {
    houseId: string;
  };
}

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeExpenses(
  data: ExpenseSummary[] | { expenses?: ExpenseSummary[] } | null
) {
  if (!data) return [] as ExpenseSummary[];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.expenses)) return data.expenses;
  return [] as ExpenseSummary[];
}

export default function HouseLandingPage({ params }: HouseLandingPageProps) {
  const router = useRouter();
  const [house, setHouse] = useState<HouseResponse | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<ExpenseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const session = getSavedSession();
    if (!session) {
      router.replace("/onboarding");
      return;
    }

    const search = new URLSearchParams(window.location.search);
    setShowJoinModal(search.get("joined") === "1");

    const loadHouseData = async () => {
      try {
        setLoading(true);
        setError("");
        const [houseRes, analyticsRes, expensesRes] = await Promise.all([
          getHouseById(params.houseId),
          getAnalytics(),
          listExpenses({ limit: 5 }),
        ]);

        setHouse(houseRes);
        setAnalytics(analyticsRes as Record<string, unknown>);
        setRecentExpenses(normalizeExpenses(expensesRes));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load house data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadHouseData();
  }, [params.houseId, router]);

  const stats = useMemo(() => {
    const total = toNumber(analytics?.totalExpenses);
    const items = toNumber(analytics?.totalItems);
    const memberCount =
      house?.members?.length ?? toNumber(analytics?.memberCount);
    const avg =
      toNumber(analytics?.avgExpensePerItem) ||
      (items > 0 ? total / items : 0);

    return { total, items, memberCount, avg };
  }, [analytics, house?.members?.length]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-60 bg-sand-200 rounded-lg animate-pulse" />
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="card h-28 animate-pulse bg-sand-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-sand-500 font-semibold">
            House Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900 mt-1">
            {house?.name || "Your House"}
          </h1>
          <p className="text-sm text-sand-500 mt-1">
            Quick snapshot of members, expenses, and spending trends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/onboarding/invite" className="btn-secondary">
            Invite Members
          </Link>
          <Link href="/expenses/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Expense
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spending"
          value={formatCurrency(stats.total)}
          icon={IndianRupee}
        />
        <StatCard
          title="Expenses Logged"
          value={stats.items.toString()}
          subtitle="items purchased"
          icon={Receipt}
        />
        <StatCard
          title="Members"
          value={stats.memberCount.toString()}
          subtitle="active in house"
          icon={Users}
        />
        <StatCard
          title="Avg Expense"
          value={formatCurrency(stats.avg)}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-sand-900">
              Recent Expenses
            </h2>
            <Link
              href="/expenses"
              className="text-sm text-haveli-700 font-medium inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-sand-500">No recent expenses found.</p>
          ) : (
            <div className="space-y-2">
              {recentExpenses.map((expense, index) => {
                const name =
                  toText(expense.itemName) ||
                  toText(expense.name) ||
                  `Expense ${index + 1}`;
                const amount = toNumber(
                  expense.totalAmount ?? expense.amount ?? expense.price
                );
                const date =
                  toText(expense.purchaseDate) ||
                  toText(expense.createdAt) ||
                  new Date().toISOString();
                const by =
                  toText((expense.addedBy as Record<string, unknown>)?.name) ||
                  toText(expense.addedByName) ||
                  "Member";

                return (
                  <div
                    key={toText(expense.id) || `${name}-${index}`}
                    className="flex items-center justify-between py-2.5 border-b border-sand-100 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-sand-900 truncate">
                        {name}
                      </p>
                      <p className="text-xs text-sand-500">
                        {by} · {formatDateTime(date)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-haveli-700">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-sand-900">
              House Members
            </h2>
            <Link href="/members" className="text-sm text-haveli-700 font-medium">
              Manage
            </Link>
          </div>
          {!house?.members?.length ? (
            <p className="text-sm text-sand-500">No members found.</p>
          ) : (
            <div className="space-y-2">
              {house.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2 border-b border-sand-100 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-sand-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-sand-500 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-sand-600 uppercase">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Welcome to your house"
      >
        <div className="space-y-4">
          <p className="text-sm text-sand-600">
            You have successfully joined{" "}
            <span className="font-semibold text-sand-900">
              {house?.name || "this house"}
            </span>
            . Explore quick insights and start tracking expenses with your members.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/expenses/new" className="btn-primary">
              Add first expense
            </Link>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowJoinModal(false)}
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
