"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  TrendingUp,
  Brain,
  Target,
  DollarSign,
  Users,
  Zap,
  CheckCircle,
  Star,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const features = [
  {
    icon: Brain,
    title: "AI Income Audit",
    description: "Brutally honest analysis of why you're underpaid and exactly what's holding you back.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: TrendingUp,
    title: "Growth Plan Generator",
    description: "Personalized roadmap to 2-5x your income with specific niches, skills, and timelines.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: FileText,
    title: "Profile Optimizer",
    description: "AI-rewritten resume, LinkedIn bio, and gig descriptions that attract premium clients.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: DollarSign,
    title: "Pricing Strategy",
    description: "Know exactly what to charge, how to justify it, and scripts to raise your rates.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Target,
    title: "Client Targeting",
    description: "Find the highest-paying clients and jobs that match your repositioned profile.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    icon: BarChart3,
    title: "Earnings Simulator",
    description: "See exactly how much more you'll make if you apply each recommendation.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Freelance Developer",
    avatar: "MT",
    content: "Went from $45/hr to $120/hr in 3 months. The niche repositioning advice was spot on.",
    increase: "+$5,400/mo",
  },
  {
    name: "Sarah K.",
    role: "UX Designer",
    avatar: "SK",
    content: "The AI found 6 income limitations I never noticed. Fixed them and landed a $180k job.",
    increase: "+$60k/yr",
  },
  {
    name: "James R.",
    role: "Marketing Consultant",
    avatar: "JR",
    content: "Profile optimizer rewrote my LinkedIn. Got 3 inbound leads in the first week.",
    increase: "+$8,000/mo",
  },
];

const stats = [
  { value: "2.4x", label: "Average income increase" },
  { value: "$4,200", label: "Avg monthly gain" },
  { value: "12 weeks", label: "Avg time to results" },
  { value: "94%", label: "User satisfaction" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">AI Income Optimizer</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Results</Link>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="gradient" size="sm">Get Started Free</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="gradient" size="sm">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Zap className="w-3 h-3 mr-1 inline" />
              AI-Powered Income Analysis
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Stop leaving{" "}
            <span className="gradient-text">money on the table</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Upload your resume. Get a brutally honest AI analysis of why you&apos;re underpaid
            and a step-by-step plan to increase your income by 2-5x.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/sign-up">
              <Button variant="gradient" size="xl" className="gap-2">
                Analyze My Income Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Free analysis included. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything you need to earn more</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Not generic career advice. Specific, data-driven strategies with dollar amounts attached.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold mb-4">3 steps to earning more</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Resume", desc: "Upload a PDF or paste your resume text. LinkedIn URL optional.", icon: FileText },
              { step: "02", title: "Get Your Income Audit", desc: "AI analyzes your profile and identifies exactly why you're underpaid.", icon: Brain },
              { step: "03", title: "Execute Your Plan", desc: "Follow your personalized roadmap to 2-5x your income.", icon: TrendingUp },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-mono text-muted-foreground mb-2">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Results</Badge>
            <h2 className="text-4xl font-bold mb-4">Real income increases</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm mb-4">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                      <Badge variant="success" className="text-xs font-bold">{t.increase}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl gradient-bg p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to earn what you deserve?</h2>
            <p className="text-white/80 text-lg mb-8">
              Get your free income analysis today. No credit card required.
            </p>
            <Link href="/sign-up">
              <Button size="xl" variant="secondary" className="gap-2">
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Free tier available</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Results in minutes</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">AI Income Optimizer</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 AI Income Optimizer</p>
        </div>
      </footer>
    </div>
  );
}
