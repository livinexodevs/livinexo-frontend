"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemAutocomplete } from "@/components/ui/item-autocomplete";
import { cn, CATEGORIES } from "@/lib/utils";
import { QUANTITY_UNITS, type QuantityUnit } from "@/lib/household-items";
import type { Member } from "@/types";
import Link from "next/link";

export default function NewExpensePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    quantityUnit: "pcs" as QuantityUnit,
    price: "",
    purchaseDate: new Date().toISOString().slice(0, 16),
    category: "General",
    notes: "",
    addedById: "",
    splitAmong: [] as string[],
  });

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          addedById: data[0].id,
          splitAmong: data.map((m: Member) => m.id),
        }));
      }
    } catch {
      console.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const toggleSplitMember = (id: string) => {
    setForm((prev) => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(id)
        ? prev.splitAmong.filter((m) => m !== id)
        : [...prev.splitAmong, id],
    }));
  };

  const qty = parseFloat(form.quantity) || 0;
  const price = parseFloat(form.price) || 0;
  const totalAmount = qty * price;
  const splitAmount =
    form.splitAmong.length > 0 ? totalAmount / form.splitAmong.length : 0;

  const isWeightOrVolume = ["kg", "g", "L", "ml"].includes(form.quantityUnit);
  const priceLabel = isWeightOrVolume
    ? `Price per ${form.quantityUnit} (₹)`
    : form.quantityUnit === "dozen"
    ? "Price per dozen (₹)"
    : "Price per piece (₹)";
  const qtyStep = isWeightOrVolume ? "0.01" : "1";
  const qtyMin = isWeightOrVolume ? "0.01" : "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (form.splitAmong.length === 0) {
      setError("Select at least one member to split the expense");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseFloat(form.quantity) || 1,
          price: parseFloat(form.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add expense");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/expenses"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-sand-200 rounded-xl animate-pulse" />
        <div className="card p-5 sm:p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-sand-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Add members first"
        description="You need at least one household member before adding expenses."
        action={
          <Link href="/members" className="btn-primary">
            Go to Members
          </Link>
        }
      />
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-sand-900 mb-2">
            Expense Added!
          </h2>
          <p className="text-sand-500">Redirecting to expenses list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-sand-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Expenses
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
          Add New Expense
        </h1>
        <p className="text-sand-500 text-sm mt-1">
          Log an item purchased for the household
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="card p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="font-semibold text-sand-800">Item Details</h2>

          <div>
            <label className="label">Item Name</label>
            <ItemAutocomplete
              value={form.itemName}
              onChange={(val) => setForm({ ...form, itemName: val })}
              onSelect={(item) =>
                setForm((prev) => ({
                  ...prev,
                  itemName: item.name,
                  category: item.category,
                  quantityUnit: (item.unit as QuantityUnit) || "pcs",
                  ...(item.price ? { price: item.price.toString() } : {}),
                }))
              }
              placeholder="e.g. Rice, Shampoo, Electricity Bill..."
            />
          </div>

          <div>
            <label className="label">Quantity Unit</label>
            <div className="flex flex-wrap gap-1.5">
              {QUANTITY_UNITS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, quantityUnit: u.value })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    form.quantityUnit === u.value
                      ? "border-haveli-500 bg-haveli-50 text-haveli-700"
                      : "border-sand-200 bg-white text-sand-500 hover:border-sand-300"
                  )}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Quantity{" "}
                <span className="text-sand-400 font-normal">
                  ({form.quantityUnit})
                </span>
              </label>
              <input
                type="number"
                className="input"
                step={qtyStep}
                min={qtyMin}
                placeholder={isWeightOrVolume ? "0.5" : "1"}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="label">{priceLabel}</label>
              <input
                type="number"
                className="input"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Purchase Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm({ ...form, purchaseDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input min-h-[80px] resize-none"
              placeholder="Any additional details..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="card p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="font-semibold text-sand-800">Added By</h2>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setForm({ ...form, addedById: member.id })}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                  form.addedById === member.id
                    ? "border-haveli-500 bg-haveli-50 text-haveli-700"
                    : "border-sand-200 bg-white text-sand-600 hover:border-sand-300"
                )}
              >
                <Avatar name={member.name} size="sm" />
                <span className="truncate max-w-[100px] sm:max-w-none">
                  {member.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sand-800">Split Among</h2>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  splitAmong:
                    form.splitAmong.length === members.length
                      ? []
                      : members.map((m) => m.id),
                })
              }
              className="text-sm text-haveli-600 hover:text-haveli-700 font-medium"
            >
              {form.splitAmong.length === members.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="space-y-2">
            {members.map((member) => {
              const isSelected = form.splitAmong.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleSplitMember(member.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-haveli-500 bg-haveli-50"
                      : "border-sand-200 bg-white hover:border-sand-300"
                  )}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                        isSelected
                          ? "bg-haveli-600 border-haveli-600"
                          : "border-sand-300"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Avatar name={member.name} size="sm" />
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-haveli-800" : "text-sand-600"
                      )}
                    >
                      {member.name}
                    </span>
                  </div>
                  {isSelected && splitAmount > 0 && (
                    <span className="text-sm font-semibold text-haveli-700 flex-shrink-0 ml-2">
                      ₹{splitAmount.toFixed(2)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {totalAmount > 0 && (
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-haveli-50 to-sand-50 border-haveli-200">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-sand-600">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-bold text-haveli-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-sand-400 mt-0.5">
              {form.quantity || 0} {form.quantityUnit} × ₹{price.toFixed(2)}/{form.quantityUnit}
            </p>
            {form.splitAmong.length > 0 && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-haveli-200/50 gap-2">
                <span className="text-xs sm:text-sm text-sand-500">
                  Split among {form.splitAmong.length} member
                  {form.splitAmong.length > 1 ? "s" : ""}
                </span>
                <span className="text-sm font-semibold text-haveli-600 flex-shrink-0">
                  ₹{splitAmount.toFixed(2)} each
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pb-4">
          <Link href="/expenses" className="btn-secondary flex-1 text-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1"
          >
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
