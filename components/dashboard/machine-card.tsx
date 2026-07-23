import { ChevronRight, Thermometer, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Machine, MachineStatus } from "@/lib/mock-data";

const statusConfig: Record<
  MachineStatus,
  { label: string; className: string }
> = {
  online: {
    label: "Online",
    className: "border-scada-teal/30 bg-scada-teal/10 text-scada-teal",
  },
  offline: {
    label: "Offline",
    className: "border-scada-muted/30 bg-scada-muted/10 text-scada-muted",
  },
  alarm: {
    label: "Alarm",
    className: "border-scada-red/30 bg-scada-red/10 text-scada-red",
  },
  maintenance: {
    label: "Maintenance",
    className: "border-scada-amber/30 bg-scada-amber/10 text-scada-amber",
  },
};

export function MachineCard({ machine }: { machine: Machine }) {
  const status = statusConfig[machine.status];

  return (
    <article
      className={cn(
        "rounded-xl border bg-scada-secondary p-4 transition-colors",
        machine.status === "alarm"
          ? "border-scada-red/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          : "border-scada-border"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-scada-cyan">{machine.code}</p>
          <h3 className="font-medium text-scada-text">{machine.name}</h3>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-scada-border bg-scada-elevated px-3 py-2">
          <div className="mb-1 flex items-center gap-1 text-[10px] text-scada-muted">
            <Thermometer className="size-3" />
            Suhu
          </div>
          <p className="font-mono text-lg font-semibold text-scada-text">
            {machine.temperature > 0 ? machine.temperature : "—"}
            {machine.temperature > 0 && (
              <span className="text-xs text-scada-muted">°C</span>
            )}
          </p>
        </div>
        <div className="rounded-lg border border-scada-border bg-scada-elevated px-3 py-2">
          <div className="mb-1 flex items-center gap-1 text-[10px] text-scada-muted">
            <Gauge className="size-3" />
            Tekanan
          </div>
          <p className="font-mono text-lg font-semibold text-scada-text">
            {machine.pressure > 0 ? machine.pressure : "—"}
            {machine.pressure > 0 && (
              <span className="text-xs text-scada-muted"> bar</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-scada-muted">
          Batch:{" "}
          <span className="font-mono text-scada-text">{machine.batchNumber}</span>
        </span>
        <ChevronRight className="size-4 text-scada-muted" />
      </div>
    </article>
  );
}
