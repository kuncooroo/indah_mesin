import Link from "next/link";
import { ArrowLeft, Menu, Search, UserCircle } from "lucide-react";

interface IndustrialHeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
}

export function IndustrialHeader({
  showBack,
  backHref = "/home",
  title = "IndustrialX",
}: IndustrialHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-4">
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            href={backHref}
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container"
          >
            <ArrowLeft className="size-5" />
          </Link>
        ) : (
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container"
            aria-label="Menu"
          >
            <Menu className="size-5" />
          </button>
        )}
        <h1 className="text-lg font-bold text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container"
          aria-label="Cari"
        >
          <Search className="size-5" />
        </button>
        <Link
          href="/profile"
          className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container"
          aria-label="Profil"
        >
          <UserCircle className="size-5" />
        </Link>
      </div>
    </header>
  );
}
