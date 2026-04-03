"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Trash2, Edit2, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/types";

export default function MembersPage() {
  const [members, setMembers] = useState<(Member & { _count: { expensesAdded: number; splits: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch {
      console.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openAddModal = () => {
    setEditingMember(null);
    setForm({ name: "", email: "" });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setForm({ name: member.name, email: member.email });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingMember
        ? `/api/members/${editingMember.id}`
        : "/api/members";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setModalOpen(false);
      fetchMembers();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from the household? Their expenses will also be deleted.`)) return;

    try {
      await fetch(`/api/members/${id}`, { method: "DELETE" });
      fetchMembers();
    } catch {
      console.error("Failed to delete member");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-sand-200 rounded-xl animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sand-200 rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-sand-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-sand-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-sand-900">Members</h1>
          <p className="text-sand-500 text-sm mt-1">
            Manage your household members
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Add your first household member to start tracking shared expenses."
          action={
            <button onClick={openAddModal} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add First Member
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.id} className="card-hover p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar name={member.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sand-900 truncate">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sand-500 text-xs sm:text-sm min-w-0">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(member)}
                    className="btn-ghost p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="btn-ghost p-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 grid grid-cols-3 gap-2">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-sand-400 uppercase tracking-wide">Added</p>
                  <p className="text-base sm:text-lg font-semibold text-sand-800">
                    {member._count.expensesAdded}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-sand-400 uppercase tracking-wide">Splits</p>
                  <p className="text-base sm:text-lg font-semibold text-sand-800">
                    {member._count.splits}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-sand-400 uppercase tracking-wide">Joined</p>
                  <p className="text-xs sm:text-sm font-medium text-sand-600 mt-0.5">
                    {formatDate(member.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? "Edit Member" : "Add New Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Arjun Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="e.g. arjun@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting
                ? "Saving..."
                : editingMember
                ? "Update Member"
                : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
