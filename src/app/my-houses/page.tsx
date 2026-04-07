"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Home,
  Loader2,
  Plus,
  Users,
  UserPlus,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import {
  getSavedSession,
  listHouses,
  type HouseResponse,
  type OnboardingSession,
} from "@/lib/onboarding";
import { formatDateTime } from "@/lib/utils";

export default function MyHousesPage() {
  const router = useRouter();
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [houses, setHouses] = useState<HouseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = getSavedSession();
    if (!saved) {
      router.replace("/auth");
      return;
    }
    setSession(saved);

    (async () => {
      try {
        const data = await listHouses();
        setHouses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your houses."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const firstName = session?.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-sand-50 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-haveli-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-orange-200/25 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <LogoMark size="lg" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-sand-900 tracking-tight">
                Hey, {firstName}
              </h1>
              <p className="text-sm text-sand-500">
                Here are your houses
              </p>
            </div>
          </div>

          {session?.avatar && (
            <img
              src={session.avatar}
              alt={session.name}
              className="w-10 h-10 rounded-full border-2 border-sand-200 object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <Link
            href="/onboarding/create-house"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-haveli-600 text-white text-sm font-medium hover:bg-haveli-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New House
          </Link>
          <Link
            href="/onboarding/join-house"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-sand-800 text-sm font-medium border border-sand-200 hover:bg-sand-100 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Join Existing House
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-haveli-600" />
            <p className="text-sm text-sand-500">Loading your houses…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && houses.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-haveli-50 text-haveli-600 flex items-center justify-center mx-auto mb-5">
              <Home className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-sand-900">
              No houses yet
            </h2>
            <p className="mt-2 text-sm text-sand-500 max-w-sm mx-auto">
              Create a new house to start tracking shared expenses, or join an
              existing one through an invitation link.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <Link href="/onboarding/create-house" className="btn-primary">
                <Plus className="w-4 h-4" />
                Create a House
              </Link>
              <Link href="/onboarding/join-house" className="btn-secondary">
                <UserPlus className="w-4 h-4" />
                Join a House
              </Link>
            </div>
          </div>
        )}

        {/* Houses grid */}
        {!loading && houses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {houses.map((house) => (
              <Link
                key={house.id}
                href={`/house/${house.id}`}
                className="group rounded-2xl bg-white border border-sand-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-haveli-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-haveli-50 text-haveli-700 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-sand-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-sand-900 truncate">
                  {house.name}
                </h3>

                <div className="mt-3 flex items-center gap-4 text-xs text-sand-500">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {house.members?.length ?? 0}{" "}
                    {(house.members?.length ?? 0) === 1 ? "member" : "members"}
                  </span>
                  {house.createdAt && (
                    <span>Created {formatDateTime(house.createdAt)}</span>
                  )}
                </div>

                {/* Member avatars */}
                {house.members && house.members.length > 0 && (
                  <div className="mt-4 flex -space-x-2">
                    {house.members.slice(0, 5).map((m) =>
                      m.avatar ? (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={m.name}
                          className="w-7 h-7 rounded-full border-2 border-white object-cover"
                        />
                      ) : (
                        <div
                          key={m.id}
                          title={m.name}
                          className="w-7 h-7 rounded-full border-2 border-white bg-haveli-100 text-haveli-700 flex items-center justify-center text-[10px] font-semibold"
                        >
                          {m.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                      )
                    )}
                    {house.members.length > 5 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-sand-100 text-sand-600 flex items-center justify-center text-[10px] font-medium">
                        +{house.members.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
