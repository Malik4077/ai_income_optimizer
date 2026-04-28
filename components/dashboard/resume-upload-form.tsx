"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function ResumeUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [currentIncome, setCurrentIncome] = useState("");
  const [employmentType, setEmploymentType] = useState("freelancer");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      setError("Please upload a PDF or paste your resume text.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else formData.append("text", resumeText);
      formData.append("currentIncome", currentIncome);
      formData.append("employmentType", employmentType);

      const res = await fetch("/api/analyze-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
        return;
      }

      router.push(`/dashboard/analysis/${data.analysisId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1">Upload PDF</TabsTrigger>
          <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-green-500 bg-green-500/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2"
                    >
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                      <Badge variant="success">Ready to analyze</Badge>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-medium">
                          {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse — PDF only, max 10MB
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paste">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="resume-text" className="mb-2 block">
                Paste your resume text
              </Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your full resume here including work experience, skills, education..."
                className="min-h-[300px] font-mono text-sm"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {resumeText.length} characters
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Income context */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Income Context (optional but improves accuracy)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="income">Current Monthly Income (USD)</Label>
              <Input
                id="income"
                type="number"
                placeholder="e.g. 5000"
                value={currentIncome}
                onChange={(e) => setCurrentIncome(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Employment Type</Label>
              <select
                id="type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="freelancer">Freelancer</option>
                <option value="employee">Employee</option>
                <option value="job_seeker">Job Seeker</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full gap-2"
        disabled={loading || (!file && !resumeText.trim())}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing your income potential...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Analyze My Income
          </>
        )}
      </Button>

      {loading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          AI is analyzing your profile... this takes 15-30 seconds
        </p>
      )}
    </form>
  );
}
