"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  Filter,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateTime, cn, CATEGORIES } from "@/lib/utils";
import type { ExpenseItem, Member } from "@/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        category: categoryFilter,
        memberId: memberFilter,
      });
      const res = await fetch(`/api/expenses?${params}`);
      const data = await res.json();
      setExpenses(data.expenses);
      setTotalPages(data.pagination.totalPages);
    } catch {
      console.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, memberFilter]);

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/members");
    setMembers(await res.json());
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    setLoading(true);
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const handleSettle = async (
    expenseId: string,
    splitId: string,
    settled: boolean
  ) => {
    await fetch(`/api/expenses/${expenseId}/settle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ splitId, settled }),
    });
    fetchExpenses();
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-sand-200 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 h-32 animate-pulse bg-sand-100" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
            Expenses
          </h1>
          <p className="text-sand-500 text-sm mt-1">
            All household expenses in one place
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "btn-secondary flex-1 sm:flex-initial",
              showFilters && "bg-sand-200 border-sand-300"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <Link
            href="/expenses/new"
            className="btn-primary flex-1 sm:flex-initial text-center"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="card p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Added By</label>
            <select
              className="input"
              value={memberFilter}
              onChange={(e) => {
                setMemberFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description={
            categoryFilter !== "all" || memberFilter !== "all"
              ? "No expenses match your current filters."
              : "Start by adding your first household expense."
          }
          action={
            categoryFilter === "all" && memberFilter === "all" ? (
              <Link href="/expenses/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                Add First Expense
              </Link>
            ) : (
              <button
                onClick={() => {
                  setCategoryFilter("all");
                  setMemberFilter("all");
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="card-hover p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <h3 className="font-semibold text-sand-900 truncate max-w-[180px] sm:max-w-none">
                          {expense.itemName}
                        </h3>
                        <span className="badge bg-sand-100 text-sand-600 border border-sand-200 flex-shrink-0 text-[10px] sm:text-xs">
                          {expense.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-base sm:text-xl font-bold text-haveli-700">
                          {formatCurrency(expense.totalAmount)}
                        </span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="btn-ghost p-1.5 text-sand-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-sand-500">
                      <span>
                        {expense.quantity}{" "}
                        {expense.quantityUnit || "pcs"} ×{" "}
                        {formatCurrency(expense.price)}/
                        {expense.quantityUnit || "pc"}
                      </span>
                      <span className="hidden sm:inline">·</span>
                      <span>{formatDateTime(expense.purchaseDate)}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="flex items-center gap-1">
                        <Avatar name={expense.addedBy.name} size="sm" />
                        {expense.addedBy.name}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                      {expense.splits.map((split) => (
                        <button
                          key={split.id}
                          onClick={() =>
                            handleSettle(expense.id, split.id, !split.settled)
                          }
                          className={cn(
                            "inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all border",
                            split.settled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          )}
                          title={
                            split.settled
                              ? "Click to mark as pending"
                              : "Click to mark as settled"
                          }
                        >
                          {split.settled && (
                            <Check className="w-3 h-3 flex-shrink-0" />
                          )}
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {split.member.name}
                          </span>
                          : {formatCurrency(split.amount)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary p-2.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-sand-600 px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary p-2.5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
