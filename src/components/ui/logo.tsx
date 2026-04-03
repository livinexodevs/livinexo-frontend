"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoMarkProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const markSizes = {
  sm: "w-7 h-7 rounded-lg",
  md: "w-9 h-9 rounded-xl",
  lg: "w-11 h-11 rounded-xl",
  xl: "w-14 h-14 rounded-2xl",
};

export function LogoMark({ size = "md", className }: LogoMarkProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-lg shadow-haveli-600/20",
        markSizes[size],
        className
      )}
    >
      <Image
        src="/livinexo-mark.png"
        alt="Livinexo logo mark"
        fill
        className="object-contain"
        sizes="56px"
      />
    </div>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const wordSizes = {
  sm: "text-sm",
  md: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
};

export function Logo({ size = "md", className }: LogoProps) {
  const markSize = size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <span
        className={cn(
          "font-bold text-sand-900 tracking-tight",
          wordSizes[size]
        )}
      >
        Livinexo
      </span>
    </div>
  );
}
