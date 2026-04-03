"use client";

import { cn } from "@/lib/utils";

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

const textSizes = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-xs",
  xl: "text-sm",
};

export function LogoMark({ size = "md", className }: LogoMarkProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-haveli-400 to-haveli-700 flex items-center justify-center shadow-lg shadow-haveli-600/20",
        markSizes[size],
        className
      )}
    >
      <span className={cn("text-white font-bold tracking-tight", textSizes[size])}>
        LX
      </span>
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
