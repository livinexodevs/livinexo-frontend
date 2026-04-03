"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { LogoMark } from "@/components/ui/logo";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function AppCookingPage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <main className="relative min-h-screen bg-sand-50 px-4 py-10 sm:py-14 flex items-center justify-center overflow-hidden">
      <div
        className="absolute -top-20 -left-24 w-72 h-72 rounded-full blur-3xl bg-haveli-300/25 pointer-events-none transition-transform duration-300"
        style={{ transform: `translate(${tilt.x * -16}px, ${tilt.y * -16}px)` }}
      />
      <div
        className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full blur-3xl bg-orange-300/20 pointer-events-none transition-transform duration-300"
        style={{ transform: `translate(${tilt.x * 20}px, ${tilt.y * 20}px)` }}
      />

      <section
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="w-full max-w-2xl card p-6 sm:p-10 text-center relative overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y * -3}deg) rotateY(${tilt.x * 3}deg)`,
          transition: "transform 120ms ease-out",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-haveli-200/25 blur-2xl"
            style={{ transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)` }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-orange-200/30 blur-2xl"
            style={{ transform: `translate(${tilt.x * -12}px, ${tilt.y * -12}px)` }}
          />
        </div>

        <div className="flex items-center justify-center mb-5">
          <LogoMark size="xl" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl" />
        </div>

        <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-haveli-50 text-haveli-700 border border-haveli-200 mb-4">
          App In Progress
        </p>

        <h1 className="text-2xl sm:text-4xl font-bold text-sand-900 tracking-tight">
          We are cooking something awesome
        </h1>
        <p className="mt-3 text-sand-600 text-sm sm:text-base max-w-xl mx-auto">
          Core screens are being prepared right now. Please check back soon while we
          finish building the full experience.
        </p>

        <div
          className="mt-6 sm:mt-8 mx-auto max-w-xs hover:scale-[1.03] transition-transform duration-300"
          style={{ filter: "sepia(1) saturate(2.2) hue-rotate(-12deg) brightness(0.98)" }}
        >
          <LottiePlayer
            autoplay
            loop
            src="https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json"
            className="w-full h-full"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <a
            href="mailto:hello@livinexo.com?subject=Notify%20me%20when%20Livinexo%20app%20is%20ready"
            className="btn-secondary"
          >
            Notify Me
          </a>
        </div>
      </section>
    </main>
  );
}
