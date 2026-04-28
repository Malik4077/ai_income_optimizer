import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    analyses: 1,
    features: [
      "1 income analysis",
      "Basic growth plan",
      "Profile score",
    ],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    analyses: -1, // unlimited
    features: [
      "Unlimited analyses",
      "Full growth plans",
      "Profile optimizer",
      "Pricing strategy",
      "Job targeting",
    ],
  },
  premium: {
    name: "Premium",
    price: 79,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    analyses: -1,
    features: [
      "Everything in Pro",
      "AI Chat assistant",
      "Earnings simulator",
      "Priority support",
      "Weekly income reports",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
