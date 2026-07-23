import { Bell, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  alarmCount?: number;
}

export function MobileHeader({
  title,
  subtitle,
  alarmCount = 0,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-scada-border bg-scada-primary/90 backdrop-blur-lg safe-top">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-scada-muted">
            Indah Mesin SCADA
          </p>
          <h1 className="text-lg font-semibold text-scada-text">{title}</h1>
          {subtitle && (
            <p className="text-xs text-scada-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className="border-scada-teal/30 bg-scada-teal/10 text-scada-teal">
            <Wifi className="size-3" />
            Live
          </Badge>
          {alarmCount > 0 && (
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-lg border border-scada-border bg-scada-elevated"
              aria-label={`${alarmCount} alarm aktif`}
            >
              <Bell className="size-4 text-scada-amber" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-scada-red text-[9px] font-bold text-white">
                {alarmCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
