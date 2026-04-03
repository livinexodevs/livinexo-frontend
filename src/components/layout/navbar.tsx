"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Receipt,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Add", href: "/expenses/new", icon: ShoppingCart },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-sand-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-haveli-600 text-white shadow-sm"
                        : "text-sand-600 hover:text-sand-900 hover:bg-sand-100"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name === "Add" ? "Add Expense" : item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="w-8 md:hidden" />
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand-200">
        <div
          className="flex items-stretch justify-around"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            if (item.href === "/expenses/new") {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-4 px-2"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-150",
                      isActive
                        ? "bg-haveli-700 shadow-haveli-600/30 scale-105"
                        : "bg-haveli-600 shadow-haveli-600/20"
                    )}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-haveli-600 mt-1">
                    {item.name}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2 px-2 min-w-[52px] transition-colors duration-150",
                  isActive ? "text-haveli-600" : "text-sand-400"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-haveli-600" />
                )}
                <item.icon
                  className={cn("w-5 h-5", isActive && "stroke-[2.5]")}
                />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
