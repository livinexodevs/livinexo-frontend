"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DoorOpen, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { getSavedSession } from "@/lib/onboarding";

export default function JoinHousePage() {
  const router = useRouter();
  const session = getSavedSession();

  useEffect(() => {
    if (!session) {
      router.replace("/onboarding");
    }
  }, [router, session]);

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-10 sm:py-16">
      <section className="max-w-xl mx-auto card p-6 sm:p-8 text-center">
        <LogoMark size="md" className="mx-auto rounded-xl" />
        <p className="inline-flex mt-4 items-center px-3 py-1 rounded-full text-xs font-medium bg-haveli-50 text-haveli-700 border border-haveli-200">
          Join House
        </p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-sand-900">
          Join flow is ready for next step
        </h1>
        <p className="mt-2 text-sm text-sand-600">
          You are authenticated with Google. Add the final join UX (invite code/link
          acceptance) on this screen.
        </p>

        <div className="mt-6 rounded-xl border border-sand-200 bg-sand-100/60 px-4 py-3 text-left">
          <p className="text-xs text-sand-500">Signed in as</p>
          <p className="text-sm font-medium text-sand-800">{session?.email ?? "-"}</p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary">
            <DoorOpen className="w-4 h-4" />
            Waiting for join details
          </button>
          <Link href="/onboarding" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <p className="mt-4 text-xs text-sand-500 inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Placeholder route implemented as requested.
        </p>
      </section>
    </main>
  );
}
