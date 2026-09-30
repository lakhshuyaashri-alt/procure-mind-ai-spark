import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  UploadCloud, FileText, Loader2, X, AlertTriangle, Building2, Hash, Tag, IndianRupee, Wallet,
  MapPin, Clock, CalendarDays, Square, ListChecks, MessageSquareText, Send, ScanSearch,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSize, useScrollIntoView } from "@/lib/ui-helpers";
import { extractPdfText, MAX_PDF_BYTES } from "@/lib/pdf-extract";
import { analyzeTender, askTender } from "@/lib/tender-analyzer.functions";
import { DATE_EVENTS, type Req, type TenderAnalysis } from "@/lib/tender-analyzer.types";

export const Route = createFileRoute("/tender-analyzer")({
  head: () => ({
    meta: [
      { title: "Tender Analyzer — ProcureMind AI" },
      { name: "description", content: "Upload a tender PDF to extract eligibility requirements, dates, required documents and key tender information." },
      { property: "og:title", content: "Tender Analyzer — ProcureMind AI" },
      { property: "og:description", content: "AI extraction of eligibility, dates and documents from government tender PDFs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TenderAnalyzer,
});

function TenderAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<TenderAnalysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeTender);

  const accept = (f?: File) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"))
      return setError("Invalid file type. Only PDF tender documents are accepted.");
    if (f.size === 0) return setError("This PDF file is empty.");
    if (f.size > MAX_PDF_BYTES) return setError("This PDF is too large. Please upload a file under 15 MB.");
    setError(null); setResult(null); setText(""); setFile(f);
  };

  const run = async () => {
    if (!file) return;
    setError(null); setResult(null);
    try {
      setStatus("Analyzing Tender...");
      let extracted: string;
      try {
        extracted = (await extractPdfText(file)).text;
      } catch {
        throw new Error("Could not read this PDF. It may be corrupted or password-protected.");
      }
      if (extracted.replace(/\[Page \d+\]/g, "").trim().length < 100)
        throw new Error("No readable text found. This looks like a scanned PDF — please upload a text-based PDF.");
      setText(extracted);
      const res = await analyze({ data: { text: extracted } });
      if (!res.ok) throw new Error(res.error);
      setResult(res.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setStatus(null);
    }
  };

  return (
    <AppShell
      title="Tender Analyzer"
      description="Upload a tender document to extract eligibility requirements, important dates, required documents and key tender information."
    >
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files[0]); }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
              dragging ? "border-primary bg-accent" : "border-border bg-secondary/40 hover:border-primary/50"
            }`}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UploadCloud className="size-7" />
            </span>
            <p className="mt-4 text-sm font-medium text-foreground">Drag & drop your tender PDF here</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF only · up to 15 MB</p>
            <Button variant="outline" className="mt-5" onClick={() => inputRef.current?.click()} disabled={!!status}>
              Browse File
            </Button>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
              onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }} />
          </div>

          {file && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="size-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
              <button aria-label="Remove file" disabled={!!status}
                onClick={() => { setFile(null); setResult(null); setText(""); setError(null); }}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={run} disabled={!file || !!status}>
              {status ? <><Loader2 className="size-4 animate-spin" /> {status}</> : <><ScanSearch className="size-4" /> Analyze Tender</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!result && !status && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Upload a tender PDF and click Analyze Tender to see the extracted information here.
        </p>
      )}
      {status && (
        <Card className="mt-6"><CardContent className="flex items-center justify-center gap-3 p-10 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" /> Analyzing Tender...
        </CardContent></Card>
      )}
      {result && <Results key={file?.name} a={result} text={text} />}
    </AppShell>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <Card><CardContent className="p-6 sm:p-7">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Icon className="size-4.5 text-primary" /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </CardContent></Card>
  );
}

function ReqCards({ items }: { items: Req[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">Not specified in the document</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((r, i) => (
        <div key={i} className="rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/40">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{r.requirement}</p>
          <p className="mt-1.5 text-sm font-semibold text-foreground">{r.value}</p>
          <p className="mt-2 text-xs text-muted-foreground">Source: {r.source}</p>
        </div>
      ))}
    </div>
  );
}

function Results({ a, text }: { a: TenderAnalysis; text: string }) {
  const ref = useScrollIntoView();
  const o = a.overview;
  const overview = [
    { label: "Tender Title", value: o.title, icon: FileText },
    { label: "Organization", value: o.organization, icon: Building2 },
    { label: "Tender ID / Reference", value: o.tender_id, icon: Hash },
    { label: "Tender Category", value: o.category, icon: Tag },
    { label: "Estimated Value", value: o.estimated_value, icon: IndianRupee },
    { label: "EMD", value: o.emd, icon: Wallet },
    { label: "Tender Location", value: o.location, icon: MapPin },
    { label: "Submission Deadline", value: o.submission_deadline, icon: Clock },
  ];
  const findDate = (ev: string) => {
    const key = ev.toLowerCase().split(" ").slice(0, 2).join(" ");
    return a.important_dates.find((d) => d.event.toLowerCase().includes(key.replace(" date", "")));
  };
  const allReqs = [...a.eligibility, ...a.financial_requirements, ...a.technical_requirements];

  return (
    <div ref={ref} className="mt-8 space-y-6 scroll-mt-20">
      <Section title="Tender Overview" icon={FileText}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overview.map((f) => (
            <div key={f.label} className="rounded-xl border border-border p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><f.icon className="size-3.5" />{f.label}</p>
              <p className="mt-1.5 text-sm font-semibold text-foreground break-words">{f.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Eligibility Requirements" icon={ListChecks}><ReqCards items={allReqs} /></Section>

      <Section title="Required Documents" icon={Square}>
        {a.required_documents.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {a.required_documents.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-lg border border-border px-3.5 py-2.5 text-sm">
                <input type="checkbox" className="mt-0.5 size-4 accent-primary" aria-label={d.document} />
                <span><span className="font-medium text-foreground">{d.document}</span>
                  <span className="block text-xs text-muted-foreground">Source: {d.source}</span></span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Not specified in the document</p>}
      </Section>

      <Section title="Important Dates" icon={CalendarDays}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATE_EVENTS.map((ev) => {
            const d = findDate(ev);
            return (
              <div key={ev} className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{ev}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{d?.date || "Not specified"}</p>
                {d && d.source !== "Not specified" && <p className="mt-1 text-xs text-muted-foreground">Source: {d.source}</p>}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Tender Summary" icon={FileText}>
        {a.summary.length ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {a.summary.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Not specified in the document</p>}
      </Section>

      <AskTender text={text} />

      <p className="text-center text-xs text-muted-foreground">
        AI-assisted extraction for decision support only. Verify all details against the original tender document.
      </p>
    </div>
  );
}

function AskTender({ text }: { text: string }) {
  const ask = useServerFn(askTender);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setErr(null); setAnswer(null);
    try {
      const r = await ask({ data: { text, question: q.trim() } });
      if (r.ok) setAnswer(r.answer); else setErr(r.error);
    } catch { setErr("Could not get an answer. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <Section title="Ask the Tender" icon={MessageSquareText}>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <Input value={q} onChange={(e) => setQ(e.target.value)} maxLength={500}
          placeholder="What is the minimum turnover requirement?" aria-label="Ask a question about this tender" />
        <Button type="submit" disabled={loading || !q.trim()}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Ask
        </Button>
      </form>
      {answer && <div className="mt-4 whitespace-pre-wrap rounded-xl bg-accent/60 p-4 text-sm text-foreground">{answer}</div>}
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
    </Section>
  );
}
