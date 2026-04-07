"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mail,
  MailPlus,
  Send,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";
import {
  getSavedHouse,
  getSavedSession,
  getHouseById,
  sendHouseInvitation,
  type HouseMember,
} from "@/lib/onboarding";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<HouseMember[]>([]);
  const [houseName, setHouseName] = useState("");
  const [houseId, setHouseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    const session = getSavedSession();
    if (!session) {
      router.replace("/auth");
      return;
    }

    const savedHouse = getSavedHouse();
    const id = savedHouse?.id;

    if (!id) {
      setError("No house selected. Go back and open a house first.");
      setLoading(false);
      return;
    }

    setHouseId(id);
    setHouseName(savedHouse?.name ?? "");

    (async () => {
      try {
        const house = await getHouseById(id);
        setMembers(house.members ?? []);
        setHouseName(house.name);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load members."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !houseId) return;

    try {
      setInviteError("");
      setInviteStatus("");
      setInviting(true);
      await sendHouseInvitation(houseId, inviteEmail.trim());
      setInviteStatus(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to send invitation."
      );
    } finally {
      setInviting(false);
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
          <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
            Members
          </h1>
          <p className="text-sand-500 text-sm mt-1">
            {houseName
              ? `People in ${houseName}`
              : "Manage your household members"}
          </p>
        </div>
        <button
          onClick={() => {
            setInviteStatus("");
            setInviteError("");
            setInviteEmail("");
            setInviteOpen(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          <MailPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Invite people to join your house and start tracking shared expenses together."
          action={
            <button
              onClick={() => setInviteOpen(true)}
              className="btn-primary"
            >
              <MailPlus className="w-4 h-4" />
              Invite First Member
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.id} className="card p-4 sm:p-5">
              <div className="flex items-center gap-3 min-w-0">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-full object-cover border border-sand-200 shrink-0"
                  />
                ) : (
                  <Avatar name={member.name} size="lg" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sand-900 truncate">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sand-500 text-xs sm:text-sm min-w-0">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between">
                {member.role && (
                  <span className="text-[10px] sm:text-xs font-medium text-haveli-700 bg-haveli-50 border border-haveli-100 px-2 py-0.5 rounded-full uppercase">
                    {member.role}
                  </span>
                )}
                {member.joinedAt && (
                  <p className="text-xs text-sand-400">
                    Joined {formatDateTime(member.joinedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a Member"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          {inviteError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {inviteError}
            </div>
          )}
          {inviteStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <MailPlus className="w-4 h-4 shrink-0" />
              {inviteStatus}
            </div>
          )}
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="friend@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              disabled={inviting}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviting || !inviteEmail.trim()}
              className="btn-primary flex-1"
            >
              {inviting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
