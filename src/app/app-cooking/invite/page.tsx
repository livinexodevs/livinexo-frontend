"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailPlus, Send } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import {
  getSavedHouse,
  getSavedSession,
  sendHouseInvitation,
} from "@/lib/onboarding";

export default function InviteMembersPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [houseId, setHouseId] = useState("");

  const session = getSavedSession();
  const savedHouse = getSavedHouse();

  useEffect(() => {
    if (!session) {
      router.replace("/onboarding");
      return;
    }

    const fromQuery = new URLSearchParams(window.location.search).get("houseId");
    setHouseId(fromQuery ?? savedHouse?.id ?? "");
  }, [router, savedHouse?.id, session]);

  const handleSendInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!houseId) {
      setError("Missing house id. Please create a house again.");
      return;
    }
    if (!session) {
      setError("Authentication required.");
      return;
    }

    try {
      setError("");
      setStatus("");
      setSending(true);
      await sendHouseInvitation(houseId, email.trim());
      setStatus(`Invitation sent to ${email.trim()}.`);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send invite.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-10 sm:py-16">
      <section className="max-w-xl mx-auto card p-6 sm:p-8">
        <div className="text-center mb-6">
          <LogoMark size="md" className="mx-auto rounded-xl" />
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-sand-900">
            Invite members
          </h1>
          <p className="mt-2 text-sm text-sand-600">
            Send email invitations to your house
            {savedHouse?.name ? ` (${savedHouse.name})` : ""}.
          </p>
        </div>

        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label htmlFor="memberEmail" className="label">
              Member Email
            </label>
            <input
              id="memberEmail"
              type="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="friend@example.com"
              disabled={sending}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={sending || !email.trim()}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Invite
              </>
            )}
          </button>
        </form>

        {status && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span className="inline-flex items-center gap-1">
              <MailPlus className="w-4 h-4" />
              {status}
            </span>
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-center">
          <Link href="/" className="btn-secondary">
            Finish for now
          </Link>
        </div>
      </section>
    </main>
  );
}
