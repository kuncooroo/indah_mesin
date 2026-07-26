import Link from "next/link";

import { Ms } from "@/components/stitch/ms";

type ProfileSettingsHeaderProps = {
  backHref?: string;
  title?: string;
};

export function ProfileSettingsHeader({
  backHref = "/beranda-artikel",
  title = "Settings",
}: ProfileSettingsHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4">
        <Link
          href={backHref}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container"
          aria-label="Back"
        >
          <Ms name="arrow_back" />
        </Link>
        <h1 className="truncate font-headline-md text-headline-md text-on-surface">{title}</h1>
        <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Ms name="person" className="text-[18px] text-on-primary" />
        </div>
      </div>
    </header>
  );
}
