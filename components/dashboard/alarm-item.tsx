import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alarm } from "@/lib/mock-data";

const severityConfig = {
  critical: {
    icon: AlertCircle,
    className: "border-scada-red/30 bg-scada-red/5",
    iconClass: "text-scada-red",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-scada-amber/30 bg-scada-amber/5",
    iconClass: "text-scada-amber",
  },
  info: {
    icon: Info,
    className: "border-scada-cyan/30 bg-scada-cyan/5",
    iconClass: "text-scada-cyan",
  },
};

export function AlarmItem({ alarm }: { alarm: Alarm }) {
  const config = severityConfig[alarm.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-3",
        config.className
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconClass)} />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-scada-cyan">
            {alarm.machineCode}
          </span>
          <span className="shrink-0 text-[10px] text-scada-muted">
            {alarm.time}
          </span>
        </div>
        <p className="text-sm text-scada-text">{alarm.message}</p>
      </div>
    </div>
  );
}
