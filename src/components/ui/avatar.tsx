"use client";

import { cn, getInitials, getAvatarColor } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-[10px] sm:w-8 sm:h-8 sm:text-xs",
  md: "w-9 h-9 text-xs sm:w-10 sm:h-10 sm:text-sm",
  lg: "w-11 h-11 text-sm sm:w-14 sm:h-14 sm:text-lg",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
        sizeClasses[size],
        getAvatarColor(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
