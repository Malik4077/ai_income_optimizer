import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getIncomeImpactColor(impact: string): string {
  switch (impact) {
    case "high":
    case "critical":
      return "text-red-500";
    case "medium":
    case "moderate":
      return "text-yellow-500";
    default:
      return "text-green-500";
  }
}

export function getPlanLimits(plan: string) {
  switch (plan) {
    case "premium":
      return { analyses: -1, chat: true, simulator: true };
    case "pro":
      return { analyses: -1, chat: false, simulator: false };
    default:
      return { analyses: 1, chat: false, simulator: false };
  }
}
