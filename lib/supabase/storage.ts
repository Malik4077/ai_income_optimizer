import { createServerSupabaseClient } from "./server";

const BUCKET = "resumes";

export async function uploadResumePDF(
  file: Buffer,
  fileName: string,
  userId: string
): Promise<string> {
  const supabase = createServerSupabaseClient();
  const path = `${userId}/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteResumeFile(fileUrl: string): Promise<void> {
  const supabase = createServerSupabaseClient();
  const path = fileUrl.split(`${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
