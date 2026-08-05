import { cn } from "@/lib/utils";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 flex items-start gap-1 text-xs font-medium text-error">
      <span aria-hidden="true">•</span>
      <span>{message}</span>
    </p>
  );
}

export function FieldHint({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] leading-snug text-on-surface-variant/80">{message}</p>;
}

export function FormAlert({
  message,
  tone = "error",
}: {
  message?: string;
  tone?: "error" | "warning" | "success";
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl p-3 text-body-sm",
        tone === "error" && "bg-error-container text-on-error-container",
        tone === "warning" && "border border-status-indent/30 bg-status-indent/10 text-on-surface",
        tone === "success" && "bg-secondary-container/40 text-on-surface"
      )}
    >
      {message}
    </div>
  );
}

export function inputErrorClass(hasError: boolean) {
  return hasError
    ? "border-error ring-2 ring-error/20 focus:border-error focus:ring-error/20"
    : "";
}
