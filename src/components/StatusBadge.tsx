import type { ComparisonStatus } from "@/lib/tender-data";

const styles: Record<ComparisonStatus, string> = {
  PASS: "bg-success/12 text-success ring-success/25",
  PARTIAL: "bg-warning/15 text-warning ring-warning/30",
  FAIL: "bg-destructive/12 text-destructive ring-destructive/25",
};

export function StatusBadge({ status }: { status: ComparisonStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
