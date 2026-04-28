import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Income Optimizer — Maximize Your Earning Potential",
  description:
    "AI-powered income analysis for freelancers and professionals. Get a personalized plan to increase your income by 2-5x.",
  keywords: ["income optimization", "AI career coach", "freelance pricing", "salary increase"],
  openGraph: {
    title: "AI Income Optimizer",
    description: "Discover exactly how to increase your income with AI-powered analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
