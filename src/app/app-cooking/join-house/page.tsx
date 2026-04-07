"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  DoorOpen,
  Loader2,
  LogIn,
  MailOpen,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import {
  acceptInvitation,
  getSavedSession,
  listHouseInvitations,
  saveHouse,
  saveSession,
  signInWithGoogle,
  type HouseInvitation,
  type OnboardingSession,
} from "@/lib/onboarding";

function getTextValue(
  invitation: HouseInvitation | undefined,
  keys: string[]
): string {
  if (!invitation) return "";
  for (const key of keys) {
    const value = invitation[key];
    if (typeof value === "string" && value.trim()) return value;
    if (value && typeof value === "object") {
      const nested = (value as Record<string, unknown>).name;
      if (typeof nested === "string" && nested.trim()) return nested;
    }
  }
  return "";
}

export default function JoinHousePage() {
  const router = useRouter();
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [token, setToken] = useState("");
  const [houseId, setHouseId] = useState("");
  const [invitations, setInvitations] = useState<HouseInvitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSession(getSavedSession());
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") ?? "");
    setHouseId(params.get("houseId") ?? "");
  }, []);

  useEffect(() => {
    if (!session || !houseId) return;

    let cancelled = false;
    const loadInvitations = async () => {
      try {
        setLoadingInvites(true);
        setError("");
        const response = await listHouseInvitations(houseId);
        if (!cancelled) {
          setInvitations(response);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to load invitation details.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoadingInvites(false);
        }
      }
    };

    loadInvitations();
    return () => {
      cancelled = true;
    };
  }, [houseId, session]);

  const activeInvitation = useMemo(() => {
    if (!invitations.length) return undefined;
    const byToken = invitations.find((invitation) => {
      const invitationToken =
        getTextValue(invitation, ["token", "invitationToken"]) || "";
      return token && invitationToken === token;
    });
    return byToken ?? invitations[0];
  }, [invitations, token]);

  const houseName =
    getTextValue(activeInvitation, ["houseName", "name", "house"]) ||
    (houseId ? `House ${houseId.slice(0, 8)}` : "Invited House");
  const invitedEmail = getTextValue(activeInvitation, ["email", "invitedEmail"]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setAuthenticating(true);
      const signedIn = await signInWithGoogle();
      saveSession(signedIn);
      setSession(signedIn);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError("Invitation token missing in link.");
      return;
    }
    if (!session) {
      setError("Please sign in with Google before joining.");
      return;
    }

    try {
      setError("");
      setStatus("");
      setAccepting(true);
      const joinedHouse = await acceptInvitation(token);
      saveHouse(joinedHouse);
      setStatus(`You joined ${joinedHouse.name} successfully.`);
      router.push(`/onboarding/invite?houseId=${joinedHouse.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to accept invitation.";
      setError(message);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-10 sm:py-16">
      <section className="max-w-xl mx-auto card p-6 sm:p-8 text-center">
        <LogoMark size="md" className="mx-auto rounded-xl" />
        <p className="inline-flex mt-4 items-center px-3 py-1 rounded-full text-xs font-medium bg-haveli-50 text-haveli-700 border border-haveli-200">
          Join House
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-sand-900">
          Join house invitation
        </h1>
        <p className="mt-2 text-sm text-sand-600">
          Opened from your invitation mail. Review the house details and accept to
          join.
        </p>

        <div className="mt-6 rounded-xl border border-sand-200 bg-sand-100/60 px-4 py-4 text-left space-y-2">
          <p className="text-xs text-sand-500 uppercase tracking-wide">House details</p>
          <p className="text-base font-semibold text-sand-900">{houseName}</p>
          {invitedEmail && (
            <p className="text-sm text-sand-600">
              Invitation sent to <span className="font-medium">{invitedEmail}</span>
            </p>
          )}
          <p className="text-xs text-sand-500">
            {loadingInvites
              ? "Loading invitation details..."
              : houseId
                ? `House ID: ${houseId}`
                : "House ID not present in link. Acceptance still works with token."}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-sand-200 bg-white px-4 py-3 text-left">
          <p className="text-xs text-sand-500">Signed in as</p>
          <p className="text-sm font-medium text-sand-800">
            {session?.email ?? "Not signed in"}
          </p>
        </div>

        {!session && (
          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={handleGoogleSignIn}
            disabled={authenticating}
          >
            {authenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Continue with Google
              </>
            )}
          </button>
        )}

        {session && (
          <button
            type="button"
            className="btn-primary mt-6 w-full"
            onClick={handleAcceptInvitation}
            disabled={accepting || !token}
          >
            {accepting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining house...
              </>
            ) : (
              <>
                <DoorOpen className="w-4 h-4" />
                Accept & Join House
              </>
            )}
          </button>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/onboarding" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {status && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {status}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <p className="mt-4 text-xs text-sand-500 inline-flex items-center gap-1">
          <MailOpen className="w-3 h-3" />
          Invite links should include query params like `?houseId=...&token=...`.
        </p>
      </section>
    </main>
  );
}
