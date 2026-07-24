import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function AdminPreviewLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Preview"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
    >
      <Eye className="h-4 w-4" strokeWidth={1.75} />
    </Link>
  );
}

export function AdminEditIconButton({
  onClick,
  title = "Edit",
}: {
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
    >
      <Pencil className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
