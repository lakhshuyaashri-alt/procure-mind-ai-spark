import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldCheck, ArrowRight, FileSearch, ListChecks, Gauge } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProcureMind AI — Procurement Assistant for MSMEs" },
      {
        name: "description",
        content:
          "ProcureMind AI simplifies government tender analysis for MSMEs with AI tender summaries and eligibility checks.",
      },
      { property: "og:title", content: "ProcureMind AI — Procurement Assistant for MSMEs" },
      {
        property: "og:description",
        content: "AI tender summaries and eligibility checks for Indian MSMEs bidding on public tenders.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Active Tenders", value: "12", icon: FileSearch },
  { label: "Tenders Analyzed", value: "8", icon: ListChecks },
  { label: "Eligibility Checks", value: "5", icon: Gauge },
];

const steps = ["Upload Tender", "Analyze Requirements", "Check Eligibility", "Make Better Bid Decisions"];

function Dashboard() {
  return (
    <AppShell
      title="Welcome to ProcureMind AI"
      description="Simplifying government tender analysis for MSMEs."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {s.value}
                </p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <s.icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <FeatureCard
          icon={FileText}
          title="AI Tender Summarizer"
          text="Upload a government tender document and get a simplified summary of important requirements, deadlines and documents."
          cta="Analyze Tender"
          to="/tender-summarizer"
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Eligibility Checker"
          text="Compare your company profile against tender requirements and identify eligibility gaps."
          cta="Check Eligibility"
          to="/eligibility-checker"
        />
      </div>

      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">How ProcureMind Works</h2>
          <div className="mt-6 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 lg:flex-1">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5 transition-colors hover:border-primary/40">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
  cta,
  to,
}: {
  icon: typeof FileText;
  title: string;
  text: string;
  cta: string;
  to: string;
}) {
  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-6 sm:p-7">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
        <div className="mt-6 pt-1">
          <Button asChild>
            <Link to={to}>
              {cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
