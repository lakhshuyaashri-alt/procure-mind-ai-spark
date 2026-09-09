import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2, ShieldCheck, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import {
  comparisonRows,
  eligibilityInsights,
  sampleCompany,
  sampleTender,
} from "@/lib/tender-data";

export const Route = createFileRoute("/eligibility-checker")({
  head: () => ({
    meta: [
      { title: "Tender Eligibility Checker — ProcureMind AI" },
      {
        name: "description",
        content:
          "Compare your company profile with government tender requirements and identify eligibility gaps before bidding.",
      },
      { property: "og:title", content: "Tender Eligibility Checker — ProcureMind AI" },
      {
        property: "og:description",
        content: "Criterion-by-criterion eligibility scoring for MSMEs bidding on public tenders.",
      },
    ],
  }),
  component: EligibilityChecker,
});

const fields = [
  { key: "companyName", label: "Company Name" },
  { key: "companyType", label: "Company Type" },
  { key: "yearsInBusiness", label: "Years in Business" },
  { key: "annualTurnover", label: "Annual Turnover" },
  { key: "relevantExperience", label: "Relevant Experience" },
  { key: "similarProjects", label: "Number of Similar Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "location", label: "Location" },
  { key: "employees", label: "Number of Employees" },
] as const;

function EligibilityChecker() {
  const [profile, setProfile] = useState({ ...sampleCompany });
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checking) return;
    const t = setTimeout(() => {
      setChecking(false);
      setResult(true);
    }, 1400);
    return () => clearTimeout(t);
  }, [checking]);

  const run = () => {
    const empty = fields.filter((f) => !profile[f.key].trim());
    if (empty.length) {
      setError(`Please complete: ${empty.map((f) => f.label).join(", ")}.`);
      return;
    }
    setError(null);
    setResult(false);
    setChecking(true);
  };

  const req = sampleTender.requirements;

  return (
    <AppShell
      title="Tender Eligibility Checker"
      description="Compare your company profile with the selected tender requirements."
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-base font-semibold text-foreground">Company Profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pre-filled with sample MSME data — edit any field to test different scenarios.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input
                    id={f.key}
                    value={profile[f.key]}
                    onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 sm:p-7">
            <h2 className="text-base font-semibold text-foreground">Tender Requirements</h2>
            <p className="mt-1 text-xs text-muted-foreground">{sampleTender.title}</p>
            <dl className="mt-5 divide-y divide-border">
              {[
                ["Minimum Turnover", req.turnover],
                ["Experience", req.experience],
                ["Certification", req.certification],
                ["Similar Projects", req.similarProjects],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <Button onClick={run} disabled={checking}>
          {checking ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          {checking ? "Evaluating profile..." : "Check Eligibility"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {!result && !checking && (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <ShieldCheck className="size-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">No eligibility result yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Run the check to see your score, a criterion-by-criterion comparison and a
              recommendation.
            </p>
          </CardContent>
        </Card>
      )}

      {result && <ResultBlock />}
    </AppShell>
  );
}

function ResultBlock() {
  const score = 75;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 80);
    return () => clearTimeout(t);
  }, []);

  const r = 54;
  const c = 2 * Math.PI * r;

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-8 p-6 sm:flex-row sm:p-8">
          <div className="relative size-36 shrink-0">
            <svg viewBox="0 0 128 128" className="size-full -rotate-90">
              <circle cx="64" cy="64" r={r} fill="none" strokeWidth="12" className="stroke-border" />
              <circle
                cx="64"
                cy="64"
                r={r}
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                className="stroke-warning transition-[stroke-dashoffset] duration-1000 ease-out"
                strokeDasharray={c}
                strokeDashoffset={c - (c * progress) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold text-foreground">{score}%</span>
              <span className="text-[11px] text-muted-foreground">Match score</span>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Eligibility Result</h2>
            <p className="mt-3 inline-flex items-center rounded-full bg-warning/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-warning ring-1 ring-inset ring-warning/30">
              PARTIALLY ELIGIBLE
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Three of four mandatory criteria are satisfied. One gap must be addressed or clarified
              with the procuring department before submitting a bid.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-foreground">Requirement Comparison</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-125 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground">
                  <th className="pb-3">Requirement</th>
                  <th className="pb-3">Required</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonRows.map((row) => (
                  <tr key={row.requirement} className="transition-colors hover:bg-secondary/50">
                    <td className="py-3.5 font-medium text-foreground">{row.requirement}</td>
                    <td className="py-3.5 text-muted-foreground">{row.required}</td>
                    <td className="py-3.5 text-muted-foreground">{row.company}</td>
                    <td className="py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-foreground">Eligibility Insights</h2>
          <ul className="mt-4 space-y-2.5">
            {eligibilityInsights.map((i) => (
              <li key={i.text} className="flex items-center gap-2.5 text-sm">
                {i.ok ? (
                  <Check className="size-4 shrink-0 text-success" />
                ) : (
                  <X className="size-4 shrink-0 text-destructive" />
                )}
                <span className={i.ok ? "text-foreground" : "text-destructive"}>{i.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/6 p-4">
            <p className="text-xs font-semibold tracking-wide text-primary">RECOMMENDATION</p>
            <p className="mt-1.5 text-sm text-foreground">
              Review the similar-project requirement before proceeding with the tender.
            </p>
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-secondary/50 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              This is an AI-assisted decision-support prototype. The result is not legally binding
              and does not guarantee tender qualification. Always confirm criteria with the official
              tender document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
