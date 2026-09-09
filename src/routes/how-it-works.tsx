import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, ScanText, ListChecks, Building2, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — ProcureMind AI" },
      {
        name: "description",
        content:
          "The ProcureMind AI workflow: upload a tender, extract information, analyze requirements and generate an eligibility result.",
      },
      { property: "og:title", content: "How It Works — ProcureMind AI" },
      {
        property: "og:description",
        content: "Five-step workflow from tender upload to eligibility result, plus the prototype technology stack.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    icon: Upload,
    title: "Upload Tender",
    text: "The user uploads a government tender document in PDF format from the summarizer module.",
  },
  {
    icon: ScanText,
    title: "Extract Information",
    text: "Text is parsed to isolate tender metadata: value, EMD, deadlines, scope and clauses.",
  },
  {
    icon: ListChecks,
    title: "Analyze Requirements",
    text: "The language model structures eligibility criteria, required documents and key conditions.",
  },
  {
    icon: Building2,
    title: "Compare Company Profile",
    text: "Stored company details are matched criterion-by-criterion against tender requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Generate Eligibility Result",
    text: "A weighted score, pass/fail breakdown and recommendation are presented for the bid decision.",
  },
];

const tech = [
  { name: "React", role: "Dashboard interface" },
  { name: "FastAPI", role: "Application API layer" },
  { name: "Python", role: "Document processing" },
  { name: "LLM", role: "Summarization & extraction" },
  { name: "RAG", role: "Grounded clause retrieval" },
  { name: "PostgreSQL", role: "Tender & profile storage" },
];

function HowItWorks() {
  return (
    <AppShell
      title="How It Works"
      description="The end-to-end workflow ProcureMind AI follows to turn a tender document into a bid decision."
    >
      <div className="space-y-4">
        {steps.map((s, i) => (
          <Card key={s.title} className="transition-shadow hover:shadow-md">
            <CardContent className="flex gap-5 p-6">
              <div className="flex flex-col items-center">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </span>
                {i < steps.length - 1 && <span className="mt-3 w-px flex-1 bg-border" />}
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
                  STEP {i + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">Technologies</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Planned stack for the full system. In this prototype only the frontend is functional and
            tender analysis uses sample data.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tech.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-secondary/50 px-4 py-3.5 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
