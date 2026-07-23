import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  accent?: "cyan" | "teal" | "amber" | "red";
}

const accentMap = {
  cyan: "text-scada-cyan bg-scada-cyan/10 border-scada-cyan/20",
  teal: "text-scada-teal bg-scada-teal/10 border-scada-teal/20",
  amber: "text-scada-amber bg-scada-amber/10 border-scada-amber/20",
  red: "text-scada-red bg-scada-red/10 border-scada-red/20",
};

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = "cyan",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-scada-border bg-scada-secondary p-3">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-[11px] font-medium text-scada-muted">{label}</p>
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-lg border",
            accentMap[accent]
          )}
        >
          <Icon className="size-3.5" />
        </div>
      </div>
      <p className="font-mono text-2xl font-bold tracking-tight text-scada-text">
        {value}
        {unit && (
          <span className="ml-0.5 text-sm font-normal text-scada-muted">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
