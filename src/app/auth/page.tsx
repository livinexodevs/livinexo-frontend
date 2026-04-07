"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Receipt,
  ShieldCheck,
  Split,
  Users,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { saveSession, signInWithGoogle } from "@/lib/onboarding";

const perks = [
  { icon: Users, text: "Add house members instantly" },
  { icon: Receipt, text: "Log shared expenses in seconds" },
  { icon: Split, text: "Auto-split costs fairly" },
  { icon: BarChart3, text: "See where every rupee goes" },
];

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildOnboardingRoute = () => {
    if (typeof window === "undefined") return "/onboarding";
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const houseId = params.get("houseId");
    const query = new URLSearchParams();
    if (token) query.set("token", token);
    if (houseId) query.set("houseId", houseId);
    const serialized = query.toString();
    return serialized ? `/onboarding?${serialized}` : "/onboarding";
  };

  const handleAuth = async () => {
    try {
      setError("");
      setLoading(true);
      const session = await signInWithGoogle();
      saveSession(session);
      router.push(buildOnboardingRoute());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ── Left: branded showcase ── */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-sand-950 via-sand-900 to-sand-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-haveli-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-haveli-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col w-full px-10 py-10 xl:px-14 xl:py-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
            <LogoMark size="lg" className="shadow-2xl shadow-haveli-600/30" />
            <span className="text-lg font-bold text-white tracking-tight">
              Livinexo
            </span>
          </Link>

          {/* Hero copy */}
          <div className="mt-auto max-w-md">
            <h2 className="text-3xl xl:text-[2.6rem] font-bold text-white tracking-tight leading-[1.15]">
              Your home&apos;s
              <br />
              <span className="bg-gradient-to-r from-haveli-400 to-orange-400 bg-clip-text text-transparent">
                finance copilot.
              </span>
            </h2>
            <p className="mt-4 text-sand-400 text-sm xl:text-[0.94rem] leading-relaxed">
              One place to track shared expenses, split costs, and know exactly
              where your money goes — for families, flatmates, and everyone
              in between.
            </p>

            {/* Perks grid */}
            <div className="mt-7 grid grid-cols-2 gap-2.5">
              {perks.map((perk) => (
                <div
                  key={perk.text}
                  className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <perk.icon className="w-3.5 h-3.5 text-haveli-300" />
                  </div>
                  <p className="text-xs text-sand-300 leading-snug">
                    {perk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mini dashboard mockup */}
          <div className="mt-8 max-w-md rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-sand-500 uppercase tracking-wider font-medium">
                Live preview
              </p>
              <div className="flex -space-x-1.5">
                {[
                  "bg-haveli-500",
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-violet-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full ${color} border-2 border-sand-900`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                {
                  icon: IndianRupee,
                  color: "text-haveli-400",
                  value: "₹24.5k",
                  label: "Total spent",
                },
                {
                  icon: Receipt,
                  color: "text-blue-400",
                  value: "47",
                  label: "Items logged",
                },
                {
                  icon: CheckCircle2,
                  color: "text-emerald-400",
                  value: "89%",
                  label: "Settled",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-white/[0.06] p-2.5 text-center"
                >
                  <stat.icon
                    className={`w-3.5 h-3.5 ${stat.color} mx-auto mb-1`}
                  />
                  <p className="text-xs font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-sand-500">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1 h-10">
              {[28, 45, 38, 60, 52, 70, 55, 65, 48, 72, 58, 80].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, hsl(${25 + i * 3}, 70%, 50%), hsl(${25 + i * 3}, 75%, 65%))`,
                      opacity: 0.7,
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-auto pt-6 text-xs text-sand-600">
            Free forever. No credit card needed.
          </p>
        </div>
      </div>

      {/* ── Right: auth panel ── */}
      <div className="flex flex-col min-h-screen lg:min-h-0 bg-sand-50 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-haveli-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-orange-200/25 blur-3xl pointer-events-none" />

        {/* Mobile-only logo bar */}
        <header className="lg:hidden px-6 pt-6 pb-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <LogoMark size="md" />
            <span className="font-bold text-sand-900 tracking-tight">
              Livinexo
            </span>
          </Link>
        </header>

        {/* Centered auth card */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 sm:py-12 lg:py-0">
          <div className="w-full max-w-[360px]">
            <h1 className="text-[1.625rem] sm:text-3xl font-bold text-sand-900 tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sand-500 text-[0.9rem] leading-relaxed">
              Sign in or create your account to get started with your house.
            </p>

            {/* Google button */}
            <button
              type="button"
              onClick={handleAuth}
              disabled={loading}
              className="mt-8 w-full h-[52px] rounded-2xl bg-sand-900 text-white font-medium text-[0.9rem] flex items-center justify-center gap-3 hover:bg-sand-800 active:scale-[0.98] transition-all shadow-lg shadow-sand-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Security note */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-white border border-sand-200 px-4 py-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-sand-500 leading-relaxed">
                Your data stays private and secure. We only use Google to verify
                your identity — nothing else is shared.
              </p>
            </div>

            {/* Divider (mobile only) */}
            <div className="mt-8 mb-6 border-t border-sand-200 lg:hidden" />

            {/* Mobile-only perks */}
            <div className="grid grid-cols-2 gap-2 lg:hidden">
              {perks.map((perk) => (
                <div
                  key={perk.text}
                  className="flex items-center gap-2 rounded-xl border border-sand-200 bg-white px-3 py-2.5"
                >
                  <perk.icon className="w-4 h-4 text-haveli-600 shrink-0" />
                  <p className="text-xs text-sand-700 leading-snug">
                    {perk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back link — aligned to the same max-width */}
        <footer className="px-6 pb-6 flex justify-center lg:justify-start">
          <div className="w-full max-w-[360px]">
            <Link
              href="/"
              className="text-xs text-sand-400 hover:text-sand-600 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to home
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
