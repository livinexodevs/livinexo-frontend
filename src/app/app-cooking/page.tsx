"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import {
  saveIntent,
  saveSession,
  signInWithGoogle,
  type OnboardingIntent,
} from "@/lib/onboarding";

const cards: {
  title: string;
  description: string;
  intent: OnboardingIntent;
  stats: string;
  points: string[];
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Create New House",
    description: "Start a fresh house and become the first member.",
    intent: "create",
    stats: "Best for new households",
    points: [
      "Create your own private house space",
      "You become the first verified member",
      "Invite others right after setup",
    ],
    icon: Home,
  },
  {
    title: "Join Existing House",
    description: "Continue with Google and join a house shared with you.",
    intent: "join",
    stats: "Fastest way to get started",
    points: [
      "Authenticate with Google in one click",
      "Join your shared house workflow",
      "Continue from invitation details",
    ],
    icon: Users,
  },
];

export default function AppCookingPage() {
  const router = useRouter();
  const [loadingIntent, setLoadingIntent] = useState<OnboardingIntent | null>(
    null
  );
  const [error, setError] = useState("");

  const buildJoinRoute = () => {
    if (typeof window === "undefined") return "/onboarding/join-house";

    const params = new URLSearchParams(window.location.search);
    const houseId = params.get("houseId");
    const token = params.get("token");

    const joinParams = new URLSearchParams();
    if (houseId) joinParams.set("houseId", houseId);
    if (token) joinParams.set("token", token);

    const query = joinParams.toString();
    return query ? `/onboarding/join-house?${query}` : "/onboarding/join-house";
  };

  const handleSelect = async (intent: OnboardingIntent) => {
    try {
      setError("");
      setLoadingIntent(intent);
      saveIntent(intent);
      const session = await signInWithGoogle();
      saveSession(session);
      router.push(intent === "create" ? "/onboarding/create-house" : buildJoinRoute());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google login failed. Please try again.";
      setError(message);
    } finally {
      setLoadingIntent(null);
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 px-4 py-8 sm:py-14 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-haveli-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-orange-200/25 blur-3xl pointer-events-none" />

      <section className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1.05fr_1.15fr] gap-6 xl:gap-10 items-start">
          <div className="card p-6 sm:p-8 lg:sticky lg:top-10">
            <LogoMark
              size="xl"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
            />
            <p className="inline-flex mt-5 items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-haveli-50 text-haveli-700 border border-haveli-200">
              <Sparkles className="w-3.5 h-3.5" />
              Onboarding
            </p>
            <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-sand-900 tracking-tight leading-tight">
              Set up your household in under a minute
            </h1>
            <p className="mt-3 text-sand-600 text-sm sm:text-base">
              Choose your path. We will securely continue with Google and then
              move you to the right flow.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-sand-200 bg-sand-100/60 px-4 py-3">
                <p className="text-xs text-sand-500 uppercase tracking-wide">
                  Security
                </p>
                <p className="mt-1 text-sm font-medium text-sand-800 inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Google authentication protected
                </p>
              </div>
              <div className="rounded-xl border border-sand-200 bg-sand-100/60 px-4 py-3">
                <p className="text-xs text-sand-500 uppercase tracking-wide">
                  Next Step
                </p>
                <p className="mt-1 text-sm font-medium text-sand-800">
                  Create house or join house based on your choice
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5">
            {cards.map((card) => {
              const isLoading = loadingIntent === card.intent;
              return (
                <button
                  type="button"
                  key={card.intent}
                  disabled={Boolean(loadingIntent)}
                  onClick={() => handleSelect(card.intent)}
                  className="group card p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-haveli-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-haveli-50 text-haveli-700 flex items-center justify-center">
                        <card.icon className="w-5 h-5" />
                      </div>
                      <h2 className="mt-4 text-xl font-semibold text-sand-900">
                        {card.title}
                      </h2>
                      <p className="mt-1 text-sm text-sand-600">
                        {card.description}
                      </p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-haveli-700 bg-haveli-50 border border-haveli-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                      {card.stats}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {card.points.map((point) => (
                      <p
                        key={point}
                        className="text-sm text-sand-700 inline-flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        {point}
                      </p>
                    ))}
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-haveli-700">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Continue with Google
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 max-w-3xl">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
