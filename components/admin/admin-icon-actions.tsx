import Link from "next/link";
import {
  Eye,
  FileText,
  GitBranch,
  ArrowLeft,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const adminIconButtonClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900";

export const adminDeleteIconButtonClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-200 text-red-700 transition-colors hover:bg-red-50 hover:text-red-800";

type AdminIconLinkProps = {
  href: string;
  title: string;
  icon: LucideIcon;
  external?: boolean;
  className?: string;
};

function AdminIconLink({ href, title, icon: Icon, external, className }: AdminIconLinkProps) {
  const classNameMerged = cn(adminIconButtonClass, className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={classNameMerged}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </a>
    );
  }
  return (
    <Link href={href} title={title} className={classNameMerged}>
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </Link>
  );
}

/** @deprecated use AdminOrderDetailLink */
export function AdminPreviewLink({ href }: { href: string }) {
  return <AdminIconLink href={href} title="Lihat detail" icon={Eye} />;
}

export function AdminOrderDetailLink({ href }: { href: string }) {
  return <AdminIconLink href={href} title="Detail PO" icon={FileText} />;
}

export function AdminOrderProgressLink({ href }: { href: string }) {
  return <AdminIconLink href={href} title="Progress WBS" icon={GitBranch} />;
}

export function AdminWbsDetailLink({ href }: { href: string }) {
  return <AdminIconLink href={href} title="Lihat template" icon={Eye} />;
}

export function AdminBackLink({ href, title = "Kembali" }: { href: string; title?: string }) {
  return <AdminIconLink href={href} title={title} icon={ArrowLeft} />;
}

export function AdminExternalLink({ href, title }: { href: string; title: string }) {
  return <AdminIconLink href={href} title={title} icon={ExternalLink} external />;
}

/** @deprecated use AdminOrderDetailLink */
export function AdminDetailLink({ href, label = "Detail" }: { href: string; label?: string }) {
  void label;
  return <AdminOrderDetailLink href={href} />;
}

export function AdminActionGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex shrink-0 flex-wrap items-center gap-1">{children}</div>;
}

export function AdminPageToolbar({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center gap-1">{children}</div>;
}
