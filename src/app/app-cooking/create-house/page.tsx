"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, UserCheck } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import {
  createHouse,
  getSavedSession,
  saveHouse,
  type HouseResponse,
} from "@/lib/onboarding";

export default function CreateHousePage() {
  const router = useRouter();
  const [houseName, setHouseName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getSavedSession()) {
      router.replace("/onboarding");
    }
  }, [router]);

  const handleCreateHouse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const session = getSavedSession();
    if (!session) {
      router.replace("/onboarding");
      return;
    }

    if (!houseName.trim()) {
      setError("House name is required.");
      return;
    }

    try {
      setError("");
      setStatus("");
      setSubmitting(true);

      const created = await createHouse(houseName.trim());

      // Defensive fallback: keep current user in members list for UI continuity.
      const includesCurrentUser = created.members.some(
        (member) =>
          member.email.toLowerCase() === session.email.toLowerCase() ||
          member.id === session.uid
      );

      const houseForState: HouseResponse = includesCurrentUser
        ? created
        : {
            ...created,
            members: [
              ...created.members,
              {
                id: session.member?.id || session.localId || session.uid,
                name: session.member?.name || session.name,
                email: session.member?.email || session.email,
                avatar: session.member?.avatar || session.avatar,
                role: "MEMBER",
                joinedAt: new Date().toISOString(),
              },
            ],
          };

      saveHouse(houseForState);
      setStatus("House created successfully. Redirecting to invitations...");
      router.push(`/onboarding/invite?houseId=${houseForState.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create house.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-10 sm:py-16">
      <section className="max-w-xl mx-auto card p-6 sm:p-8">
        <div className="text-center mb-6">
          <LogoMark size="md" className="mx-auto rounded-xl" />
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-sand-900">
            Create your house
          </h1>
          <p className="mt-2 text-sm text-sand-600">
            Add a house name to continue. You will be added as a member.
          </p>
        </div>

        <form onSubmit={handleCreateHouse} className="space-y-4">
          <div>
            <label htmlFor="houseName" className="label">
              House Name
            </label>
            <input
              id="houseName"
              className="input"
              type="text"
              value={houseName}
              onChange={(event) => setHouseName(event.target.value)}
              placeholder="e.g. Maple Residency"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting || !houseName.trim()}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create House
              </>
            )}
          </button>
        </form>

        {status && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span className="inline-flex items-center gap-1">
              <UserCheck className="w-4 h-4" />
              {status}
            </span>
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
