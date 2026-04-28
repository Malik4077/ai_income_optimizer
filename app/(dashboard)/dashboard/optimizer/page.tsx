"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, CheckCircle, FileText, Linkedin, Briefcase } from "lucide-react";

export default function OptimizerPage() {
  const [analysisId, setAnalysisId] = useState("");
  const [targetNiche, setTargetNiche] = useState("");
  const [currentRate, setCurrentRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    resume_summary: string;
    linkedin_bio: string;
    linkedin_headline: string;
    gig_descriptions: Array<{ platform: string; title: string; description: string; keywords: string[] }>;
    pricing_strategy: {
      hourly_rate: { current: number; recommended: number; premium: number };
      raise_justification: string;
    };
    keywords: string[];
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!analysisId || !targetNiche) {
      setError("Please provide analysis ID and target niche.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, targetNiche, currentRate: parseFloat(currentRate) || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.optimized);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Optimizer</h1>
        <p className="text-muted-foreground">AI-rewritten profiles for maximum income potential</p>
      </div>

      {!result && (
        <Card>
          <CardHeader><CardTitle>Generate Optimized Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Analysis ID</Label>
              <Input
                placeholder="Paste your analysis ID from the analysis page"
                value={analysisId}
                onChange={(e) => setAnalysisId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Target Niche</Label>
              <Input
                placeholder="e.g. Shopify CRO Specialist for DTC brands"
                value={targetNiche}
                onChange={(e) => setTargetNiche(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Current Hourly Rate (USD)</Label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={currentRate}
                onChange={(e) => setCurrentRate(e.target.value)}
                className="mt-1"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button variant="gradient" onClick={handleOptimize} disabled={loading} className="w-full gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Optimizing...</> : "Optimize My Profile"}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <Tabs defaultValue="resume">
          <TabsList className="w-full">
            <TabsTrigger value="resume" className="flex-1"><FileText className="w-3 h-3 mr-1" />Resume</TabsTrigger>
            <TabsTrigger value="linkedin" className="flex-1"><Linkedin className="w-3 h-3 mr-1" />LinkedIn</TabsTrigger>
            <TabsTrigger value="gigs" className="flex-1"><Briefcase className="w-3 h-3 mr-1" />Gigs</TabsTrigger>
            <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Resume Summary
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.resume_summary, "resume")} className="gap-1">
                    {copied === "resume" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted text-sm leading-relaxed">{result.resume_summary}</div>
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Keywords to include:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((k) => (
                      <Badge key={k} variant="secondary">{k}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="linkedin">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Headline</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.linkedin_headline, "headline")} className="gap-1">
                      {copied === "headline" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      Copy
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-sm font-medium">{result.linkedin_headline}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">About Section</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.linkedin_bio, "bio")} className="gap-1">
                      {copied === "bio" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      Copy
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-sm leading-relaxed">{result.linkedin_bio}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs" className="space-y-4">
            {result.gig_descriptions.map((gig, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{gig.platform} — {gig.title}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(gig.description, `gig-${i}`)} className="gap-1">
                      {copied === `gig-${i}` ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-muted text-sm leading-relaxed mb-3">{gig.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {gig.keywords.map((k) => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="text-2xl font-bold">${result.pricing_strategy.hourly_rate.current}/hr</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-muted-foreground mb-1">Recommended</p>
                    <p className="text-2xl font-bold text-green-500">${result.pricing_strategy.hourly_rate.recommended}/hr</p>
                  </div>
                  <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <p className="text-xs text-muted-foreground mb-1">Premium Tier</p>
                    <p className="text-2xl font-bold text-violet-500">${result.pricing_strategy.hourly_rate.premium}/hr</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Rate Increase Script</p>
                  <div className="p-4 rounded-lg bg-muted text-sm font-mono leading-relaxed">
                    {result.pricing_strategy.raise_justification}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {result && (
        <Button variant="outline" onClick={() => setResult(null)} className="w-full">
          Generate New Optimization
        </Button>
      )}
    </div>
  );
}
