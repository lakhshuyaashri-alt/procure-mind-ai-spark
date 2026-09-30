import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Workflow,
  Menu,
  X,
  Sparkles,
  ScanSearch,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tender-summarizer", label: "Tender Summarizer", icon: FileText },
  { to: "/tender-analyzer", label: "Tender Analyzer", icon: ScanSearch },
  { to: "/eligibility-checker", label: "Eligibility Checker", icon: ShieldCheck },
  { to: "/how-it-works", label: "How It Works", icon: Workflow },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4.5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">ProcureMind AI</p>
            <p className="text-[11px] text-muted-foreground">Procurement Intelligence</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
              }}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mx-4 mt-4 rounded-xl border border-sidebar-border bg-accent/60 p-4">
          <p className="text-xs font-semibold text-foreground">Prototype build</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Decision-support only. Results are AI-assisted and not legally binding.
          </p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 px-5 backdrop-blur lg:px-8">
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="hidden text-sm font-medium text-muted-foreground sm:block">
            Public Procurement Workspace
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-semibold text-foreground">Lakhshuyaa Shri</p>
              <p className="text-[11px] text-muted-foreground">ABC Technologies Pvt Ltd</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              LS
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
