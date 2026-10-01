import { NOT_SPECIFIED, type TenderAnalysis } from "./tender-analyzer.types";

export type TenderRequirements = {
  turnover: string;
  experience: string;
  certification: string;
  similarProjects: string;
};

export type StoredTender = {
  title: string;
  requirements: TenderRequirements;
};

const KEY = "procuremind.analyzed-tender";
const UNSPECIFIED = "Not specified";

export function saveAnalyzedTender(t: StoredTender) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(t));
  } catch {
    /* storage unavailable — the checker simply falls back to the sample tender */
  }
}

export function loadAnalyzedTender(): StoredTender | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredTender;
    if (!p?.requirements) return null;
    return p;
  } catch {
    return null;
  }
}

export function clearAnalyzedTender() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

const allReqs = (a: TenderAnalysis) => [
  ...a.eligibility,
  ...a.financial_requirements,
  ...a.technical_requirements,
];

function pick(a: TenderAnalysis, words: string[]) {
  const hit = allReqs(a).find((r) => {
    const t = r.requirement.toLowerCase();
    return words.some((w) => t.includes(w));
  });
  const v = hit?.value?.trim();
  return v && v !== NOT_SPECIFIED ? v : UNSPECIFIED;
}

/** Pulls the four checkable criteria out of an AI tender analysis. */
export function deriveRequirements(a: TenderAnalysis): StoredTender {
  return {
    title: a.overview.title && a.overview.title !== NOT_SPECIFIED ? a.overview.title : "Analyzed tender",
    requirements: {
      turnover: pick(a, ["turnover", "annual revenue", "revenue"]),
      experience: pick(a, ["experience", "years in", "year of"]),
      certification: pick(a, ["iso", "certif", "quality"]),
      similarProjects: pick(a, ["similar", "completed project", "past project", "work order"]),
    },
  };
}

/** Plain-text executive summary of an analysis, for download. */
export function buildSummaryText(a: TenderAnalysis): string {
  const o = a.overview;
  const line = (k: string, v: string) => `${k}: ${v}`;
  const out: string[] = [
    "PROCUREMIND AI — TENDER SUMMARY",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "TENDER OVERVIEW",
    line("Tender Title", o.title),
    line("Organization", o.organization),
    line("Tender ID / Reference", o.tender_id),
    line("Tender Category", o.category),
    line("Estimated Value", o.estimated_value),
    line("EMD", o.emd),
    line("Tender Location", o.location),
    line("Submission Deadline", o.submission_deadline),
    "",
    "ELIGIBILITY & OTHER REQUIREMENTS",
  ];
  const reqs = allReqs(a);
  out.push(
    ...(reqs.length
      ? reqs.map((r) => `- ${r.requirement}: ${r.value} (Source: ${r.source})`)
      : ["- " + NOT_SPECIFIED]),
  );

  out.push("", "REQUIRED DOCUMENTS");
  out.push(
    ...(a.required_documents.length
      ? a.required_documents.map((d) => `[ ] ${d.document} (Source: ${d.source})`)
      : ["- " + NOT_SPECIFIED]),
  );

  out.push("", "IMPORTANT DATES");
  out.push(
    ...(a.important_dates.length
      ? a.important_dates.map((d) => `- ${d.event}: ${d.date}`)
      : ["- " + NOT_SPECIFIED]),
  );

  out.push("", "SUMMARY");
  out.push(...(a.summary.length ? a.summary.map((s) => `- ${s}`) : ["- " + NOT_SPECIFIED]));

  out.push(
    "",
    "AI-assisted extraction for decision support only. Verify all details against the original tender document.",
  );
  return out.join("\n");
}

export function downloadText(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
