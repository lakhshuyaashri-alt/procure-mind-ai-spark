import type { ComparisonStatus } from "./tender-data";
import type { TenderRequirements } from "./analyzed-tender";

export type Profile = {
  companyName: string;
  companyType: string;
  yearsInBusiness: string;
  annualTurnover: string;
  relevantExperience: string;
  similarProjects: string;
  certifications: string;
  location: string;
  employees: string;
};

export type Row = {
  requirement: string;
  required: string;
  company: string;
  status: ComparisonStatus;
};

export type Evaluation = {
  rows: Row[];
  score: number;
  verdict: "ELIGIBLE" | "PARTIALLY ELIGIBLE" | "NOT ELIGIBLE";
  insights: { ok: boolean; text: string }[];
  recommendation: string;
};

const UNKNOWN = ["", "not specified", "not specified in the document", "n/a", "na"];
const isUnknown = (v: string) => UNKNOWN.includes(v.trim().toLowerCase());

/** Money in lakhs; returns null when the text has no usable figure. */
function toLakhs(v: string): number | null {
  const t = v.toLowerCase().replace(/,/g, "");
  const m = t.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  if (/crore|crores|\bcr\b/.test(t)) return n * 100;
  if (/lakh|lac/.test(t)) return n;
  if (n > 100000) return n / 100000; // plain rupee amount
  return n;
}

function firstNumber(v: string): number | null {
  const m = v.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function numeric(required: string, actual: string): ComparisonStatus {
  if (isUnknown(required)) return "PARTIAL";
  const r = firstNumber(required);
  const a = firstNumber(actual);
  if (r === null || a === null) return "PARTIAL";
  if (a >= r) return "PASS";
  return a >= r * 0.7 ? "PARTIAL" : "FAIL";
}

function money(required: string, actual: string): ComparisonStatus {
  if (isUnknown(required)) return "PARTIAL";
  const r = toLakhs(required);
  const a = toLakhs(actual);
  if (r === null || a === null) return "PARTIAL";
  if (a >= r) return "PASS";
  return a >= r * 0.7 ? "PARTIAL" : "FAIL";
}

function cert(required: string, held: string): ComparisonStatus {
  if (isUnknown(required)) return "PARTIAL";
  const h = held.toLowerCase();
  const tokens = required.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const key = tokens.filter((t) => t.length > 2 && !["the", "valid", "certificate", "certification", "required"].includes(t));
  if (!key.length) return "PARTIAL";
  const hits = key.filter((t) => h.includes(t)).length;
  if (hits === key.length) return "PASS";
  return hits > 0 ? "PARTIAL" : "FAIL";
}

const WEIGHT: Record<ComparisonStatus, number> = { PASS: 100, PARTIAL: 50, FAIL: 0 };

export function evaluate(profile: Profile, req: TenderRequirements): Evaluation {
  const rows: Row[] = [
    {
      requirement: "Annual Turnover",
      required: isUnknown(req.turnover) ? "Not specified" : req.turnover,
      company: profile.annualTurnover,
      status: money(req.turnover, profile.annualTurnover),
    },
    {
      requirement: "Experience",
      required: isUnknown(req.experience) ? "Not specified" : req.experience,
      company: `${profile.yearsInBusiness} Years`,
      status: numeric(req.experience, profile.yearsInBusiness),
    },
    {
      requirement: isUnknown(req.certification) ? "Certification" : req.certification,
      required: isUnknown(req.certification) ? "Not specified" : "Required",
      company: profile.certifications || "None",
      status: cert(req.certification, profile.certifications),
    },
    {
      requirement: "Similar Projects",
      required: isUnknown(req.similarProjects) ? "Not specified" : req.similarProjects,
      company: profile.similarProjects,
      status: numeric(req.similarProjects, profile.similarProjects),
    },
  ];

  const score = Math.round(rows.reduce((s, r) => s + WEIGHT[r.status], 0) / rows.length);
  const verdict: Evaluation["verdict"] = rows.every((r) => r.status === "PASS")
    ? "ELIGIBLE"
    : score >= 50
      ? "PARTIALLY ELIGIBLE"
      : "NOT ELIGIBLE";

  const label: Record<ComparisonStatus, string> = {
    PASS: "requirement satisfied",
    PARTIAL: "requirement needs clarification",
    FAIL: "requirement not satisfied",
  };
  const insights = rows.map((r) => ({
    ok: r.status === "PASS",
    text: `${r.requirement} — ${label[r.status]}`,
  }));

  const gaps = rows.filter((r) => r.status !== "PASS").map((r) => r.requirement);
  const recommendation = !gaps.length
    ? "All mandatory criteria are met. You may proceed with bid preparation."
    : verdict === "PARTIALLY ELIGIBLE"
      ? `Address or clarify ${gaps.join(", ")} with the procuring department before submitting a bid.`
      : `Multiple mandatory criteria are unmet (${gaps.join(", ")}). Consider a joint venture or a more suitable tender.`;

  return { rows, score, verdict, insights, recommendation };
}
