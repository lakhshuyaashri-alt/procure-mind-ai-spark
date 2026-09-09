import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Loader2,
  Download,
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  Check,
  Circle,
  X,
  CalendarDays,
  Building2,
  IndianRupee,
  Clock,
  Wallet,
  Hash,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sampleTender } from "@/lib/tender-data";

export const Route = createFileRoute("/tender-summarizer")({
  head: () => ({
    meta: [
      { title: "AI Tender Summarizer — ProcureMind AI" },
      {
        name: "description",
        content:
          "Convert lengthy government tender documents into clear, actionable requirements, deadlines and document checklists.",
      },
      { property: "og:title", content: "AI Tender Summarizer — ProcureMind AI" },
      {
        property: "og:description",
        content: "Upload a tender PDF and get a structured summary with eligibility criteria and AI insights.",
      },
    ],
  }),
  component: TenderSummarizer,
});

const stages = ["Analyzing Tender...", "Extracting requirements...", "Generating summary..."];

function TenderSummarizer() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState(-1);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage < 0 || stage > stages.length - 1) return;
    const t = setTimeout(() => {
      if (stage === stages.length - 1) {
        setStage(-1);
        setDone(true);
      } else {
        setStage(stage + 1);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [stage]);

  const accept = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF tender documents are supported. Please select a .pdf file.");
      return;
    }
    setError(null);
    setDone(false);
    setStage(-1);
    setFile(f);
  };

  const analyzing = stage >= 0;

  return (
    <AppShell
      title="AI Tender Summarizer"
      description="Convert lengthy government tender documents into clear, actionable information."
    >
      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-base font-semibold text-foreground">Upload Tender PDF</h2>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files?.[0]);
            }}
            className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
              dragging ? "border-primary bg-accent" : "border-border bg-secondary/40"
            }`}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UploadCloud className="size-7" />
            </span>
            <p className="mt-4 text-sm font-medium text-foreground">
              Drag &amp; drop your tender PDF here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PDF only · up to 25 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
            />
            <Button variant="outline" className="mt-5" onClick={() => inputRef.current?.click()}>
              Browse File
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                <FileText className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · ready to analyze
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDone(false);
                  setStage(-1);
                }}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              disabled={!file || analyzing}
              onClick={() => {
                setDone(false);
                setStage(0);
              }}
            >
              {analyzing && <Loader2 className="size-4 animate-spin" />}
              {analyzing ? stages[stage] : "Analyze Tender"}
            </Button>
            {!file && (
              <p className="text-xs text-muted-foreground">
                Select a tender PDF to enable analysis.
              </p>
            )}
          </div>

          {analyzing && (
            <div className="mt-5 space-y-2.5">
              {stages.map((s, i) => (
                <div key={s} className="flex items-center gap-2.5 text-sm">
                  {i < stage ? (
                    <Check className="size-4 text-success" />
                  ) : i === stage ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/50" />
                  )}
                  <span className={i <= stage ? "text-foreground" : "text-muted-foreground"}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!done && !analyzing && (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <FileText className="size-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm font-medium text-foreground">No analysis yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Upload a tender document and run the analysis to see the structured summary, document
              checklist and AI insights here.
            </p>
          </CardContent>
        </Card>
      )}

      {done && <Result />}
    </AppShell>
  );
}

const insightIcon = {
  "High Priority": AlertTriangle,
  "Eligibility Risk": ShieldAlert,
  "Document Risk": FileWarning,
} as const;

const insightTone = {
  "High Priority": "border-destructive/30 bg-destructive/6 text-destructive",
  "Eligibility Risk": "border-warning/35 bg-warning/8 text-warning",
  "Document Risk": "border-primary/30 bg-primary/6 text-primary",
} as const;

function Result() {
  const t = sampleTender;

  const overview = [
    { icon: FileText, label: "Tender Title", value: t.title },
    { icon: Building2, label: "Organization", value: t.organization },
    { icon: IndianRupee, label: "Tender Value", value: t.value },
    { icon: CalendarDays, label: "Submission Deadline", value: t.deadline },
    { icon: Wallet, label: "EMD", value: t.emd },
    { icon: Clock, label: "Work Completion Period", value: t.completionPeriod },
    { icon: Hash, label: "Reference No.", value: t.referenceNo },
  ];

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">Tender Overview</h2>
            <span className="rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-inset ring-success/25">
              ANALYSIS COMPLETE
            </span>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overview.map((o) => (
              <div key={o.label} className="rounded-xl border border-border bg-secondary/40 p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <o.icon className="size-3.5" />
                  {o.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
                  {o.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Section n={1} title="Tender Summary">
        <p className="text-sm leading-relaxed text-muted-foreground">{t.summary}</p>
      </Section>

      <Section n={2} title="Eligibility Requirements">
        <ul className="space-y-2.5">
          {t.eligibility.map((e) => (
            <li key={e} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary" />
              {e}
            </li>
          ))}
        </ul>
      </Section>

      <Section n={3} title="Required Documents">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {t.documents.map((d) => (
            <li
              key={d.name}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                d.available
                  ? "border-success/25 bg-success/6 text-foreground"
                  : "border-warning/35 bg-warning/8 text-foreground"
              }`}
            >
              {d.available ? (
                <Check className="size-4 shrink-0 text-success" />
              ) : (
                <Circle className="size-4 shrink-0 text-warning" />
              )}
              <span className="flex-1">{d.name}</span>
              {!d.available && (
                <span className="text-[11px] font-semibold text-warning">PENDING</span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section n={4} title="Scope of Work">
        <p className="text-sm leading-relaxed text-muted-foreground">{t.scope}</p>
      </Section>

      <Section n={5} title="Important Dates">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.dates.map((d) => (
            <div key={d.label} className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs text-muted-foreground">{d.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{d.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n={6} title="Important Conditions">
        <ol className="space-y-3">
          {t.conditions.map((c, i) => (
            <li key={c} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              {c}
            </li>
          ))}
        </ol>
      </Section>

      <Section n={7} title="AI Insights">
        <div className="grid gap-4 lg:grid-cols-3">
          {t.insights.map((ins) => {
            const Icon = insightIcon[ins.level];
            return (
              <div
                key={ins.level}
                className={`rounded-xl border p-4 transition-shadow hover:shadow-sm ${insightTone[ins.level]}`}
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Icon className="size-4" />
                  {ins.level}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ins.text}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <p className="max-w-xl text-xs text-muted-foreground">
          AI-assisted decision support. Summaries may omit clauses — always verify against the
          original tender document before bidding.
        </p>
        <Button onClick={() => downloadSummary()}>
          <Download className="size-4" />
          Download Summary
        </Button>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold text-foreground">
          <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground">
            {n}
          </span>
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}

function downloadSummary() {
  const t = sampleTender;
  const lines = [
    "PROCUREMIND AI — TENDER SUMMARY",
    "",
    `Tender Title: ${t.title}`,
    `Organization: ${t.organization}`,
    `Reference No: ${t.referenceNo}`,
    `Tender Value: ${t.value}`,
    `EMD: ${t.emd}`,
    `Submission Deadline: ${t.deadline}`,
    `Work Completion Period: ${t.completionPeriod}`,
    "",
    "SUMMARY",
    t.summary,
    "",
    "ELIGIBILITY REQUIREMENTS",
    ...t.eligibility.map((e) => `- ${e}`),
    "",
    "REQUIRED DOCUMENTS",
    ...t.documents.map((d) => `[${d.available ? "x" : " "}] ${d.name}`),
    "",
    "SCOPE OF WORK",
    t.scope,
    "",
    "IMPORTANT DATES",
    ...t.dates.map((d) => `${d.label}: ${d.value}`),
    "",
    "IMPORTANT CONDITIONS",
    ...t.conditions.map((c, i) => `${i + 1}. ${c}`),
    "",
    "AI INSIGHTS",
    ...t.insights.map((i) => `${i.level}: ${i.text}`),
    "",
    "Note: AI-assisted decision support only. Not legally binding.",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "procuremind-tender-summary.txt";
  a.click();
  URL.revokeObjectURL(url);
}
