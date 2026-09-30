import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { NOT_SPECIFIED, type TenderAnalysis } from "./tender-analyzer.types";

const MAX_CHARS = 120_000;

const SYSTEM = `You are ProcureMind, an AI assistant for public procurement.

Analyze the uploaded government tender document.

Extract information ONLY from the provided document.

Do not invent, assume, or infer missing values.

Return 'Not specified in the document' when information is unavailable.

Extract:

1. Tender overview
2. Eligibility requirements
3. Financial requirements
4. Technical requirements
5. Required documents
6. Important dates
7. Tender summary

For every important requirement, preserve the relevant clause or section reference whenever possible.

The output will be used by an eligibility-checking module later.

Respond with ONLY valid JSON in exactly this shape:
{"overview":{"title":"","organization":"","tender_id":"","category":"","estimated_value":"","emd":"","location":"","submission_deadline":""},
"eligibility":[{"requirement":"","value":"","source":""}],
"financial_requirements":[{"requirement":"","value":"","source":""}],
"technical_requirements":[{"requirement":"","value":"","source":""}],
"required_documents":[{"document":"","source":""}],
"important_dates":[{"event":"","date":"","source":""}],
"summary":["5 to 8 concise points covering what is procured, issuer, scope, eligibility highlights, financial requirements, deadlines, documents, major conditions"]}
For important_dates use events such as: Tender Publication Date, Pre-Bid Meeting Date, Query Submission Deadline, Bid Submission Deadline, Technical Bid Opening, Financial Bid Opening. Use "Not specified" as source when no clause reference exists.`;

async function callAI(messages: { role: string; content: string }[], json: boolean) {
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) throw new Error("The analysis service is not configured.");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (res.status === 429) throw new Error("Too many requests right now. Please wait a moment and try again.");
  if (res.status === 402) throw new Error("AI usage credits are exhausted. Please add credits and try again.");
  if (!res.ok) {
    console.error("AI gateway error", res.status, await res.text());
    throw new Error("The analysis service is temporarily unavailable. Please try again.");
  }
  const data = await res.json();
  return String(data?.choices?.[0]?.message?.content ?? "");
}

const s = (v: unknown, fb = NOT_SPECIFIED) => (typeof v === "string" && v.trim() ? v.trim() : fb);
const arr = (v: unknown) => (Array.isArray(v) ? v : []);

function normalize(raw: any): TenderAnalysis {
  const o = raw?.overview ?? {};
  const req = (x: any) => ({ requirement: s(x?.requirement), value: s(x?.value), source: s(x?.source, "Not specified") });
  return {
    overview: {
      title: s(o.title), organization: s(o.organization), tender_id: s(o.tender_id), category: s(o.category),
      estimated_value: s(o.estimated_value), emd: s(o.emd), location: s(o.location), submission_deadline: s(o.submission_deadline),
    },
    eligibility: arr(raw?.eligibility).map(req),
    financial_requirements: arr(raw?.financial_requirements).map(req),
    technical_requirements: arr(raw?.technical_requirements).map(req),
    required_documents: arr(raw?.required_documents)
      .map((d: any) => ({ document: s(d?.document, ""), source: s(d?.source, "Not specified") }))
      .filter((d) => d.document),
    important_dates: arr(raw?.important_dates).map((d: any) => ({
      event: s(d?.event, ""), date: s(d?.date, "Not specified"), source: s(d?.source, "Not specified"),
    })),
    summary: arr(raw?.summary).filter((x: unknown) => typeof x === "string" && x.trim()),
  };
}

export const analyzeTender = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ text: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ ok: true; analysis: TenderAnalysis } | { ok: false; error: string }> => {
    try {
      const content = await callAI(
        [
          { role: "system", content: SYSTEM },
          { role: "user", content: `TENDER DOCUMENT:\n\n${data.text.slice(0, MAX_CHARS)}` },
        ],
        true,
      );
      let parsed: unknown;
      try {
        parsed = JSON.parse(content.replace(/^```(json)?|```$/g, "").trim());
      } catch {
        return { ok: false, error: "The AI returned an unreadable response. Please try analyzing again." };
      }
      return { ok: true, analysis: normalize(parsed) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Analysis failed. Please try again." };
    }
  });

export const askTender = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ text: z.string().min(1), question: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data }): Promise<{ ok: true; answer: string } | { ok: false; error: string }> => {
    try {
      const answer = await callAI(
        [
          {
            role: "system",
            content:
              'You are ProcureMind. Answer the question using ONLY the tender document provided. Be concise and cite the clause/section if available. If the answer is not in the document, reply exactly: "Information not found in the uploaded tender."',
          },
          { role: "user", content: `TENDER DOCUMENT:\n\n${data.text.slice(0, MAX_CHARS)}\n\nQUESTION: ${data.question}` },
        ],
        false,
      );
      return { ok: true, answer: answer.trim() || "Information not found in the uploaded tender." };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not answer. Please try again." };
    }
  });
