import Link from "next/link";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { shopCanvasClassName } from "@/lib/storefront/layout-mode";
import { cn } from "@/lib/utils";

type ProfileSettingsHeaderProps = {
  backHref?: string;
  title?: string;
};

export function ProfileSettingsHeader({
  backHref = "/beranda-artikel",
  title = "Settings",
}: ProfileSettingsHeaderProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div
        className={cn(
          "pointer-events-auto w-full bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl",
          shopCanvasClassName()
        )}
      >
        <div className="flex h-16 items-center gap-4 px-4">
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
            aria-label="Back"
          >
            <MaterialSymbol name="arrow_back" />
          </Link>
          <h1 className="truncate font-headline-md text-headline-md text-on-surface">{title}</h1>
        </div>
      </div>
    </header>
  );
}
