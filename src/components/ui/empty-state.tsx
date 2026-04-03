"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4",
        className
      )}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sand-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-sand-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-sand-800 mb-1">
        {title}
      </h3>
      <p className="text-sm text-sand-500 max-w-xs sm:max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
