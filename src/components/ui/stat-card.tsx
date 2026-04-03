"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn("card p-4 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-sand-500">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-sand-900 mt-1 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-sand-400 mt-0.5">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs sm:text-sm font-medium mt-1",
                trend.positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </p>
          )}
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-haveli-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-haveli-600" />
        </div>
      </div>
    </div>
  );
}
