import { ResumeUploadForm } from "@/components/dashboard/resume-upload-form";

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Your Resume</h1>
        <p className="text-muted-foreground">
          Upload a PDF or paste your resume text to start your income analysis.
        </p>
      </div>
      <ResumeUploadForm />
    </div>
  );
}
