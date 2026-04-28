// Server-side PDF text extraction
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid client-side bundling
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}
