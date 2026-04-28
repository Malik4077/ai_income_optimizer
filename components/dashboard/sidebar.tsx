"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  TrendingUp,
  FileText,
  MessageSquare,
  CreditCard,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Resume", icon: Upload },
  { href: "/dashboard/analysis", label: "Income Analysis", icon: BarChart3 },
  { href: "/dashboard/growth-plan", label: "Growth Plan", icon: TrendingUp },
  { href: "/dashboard/optimizer", label: "Profile Optimizer", icon: FileText },
  { href: "/dashboard/simulator", label: "Earnings Simulator", icon: Zap },
  { href: "/dashboard/chat", label: "AI Coach", icon: MessageSquare },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Income Optimizer</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "gradient-bg text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Free Plan</p>
          <p>1 analysis included</p>
          <Link href="/pricing" className="text-primary hover:underline mt-1 block">
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </aside>
  );
}
