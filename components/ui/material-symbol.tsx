import { cn } from "@/lib/utils";

type MaterialSymbolProps = {
  name: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
};

export function MaterialSymbol({
  name,
  className,
  fill,
  style,
}: MaterialSymbolProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        ...(fill ? { fontVariationSettings: "'FILL' 1" } : undefined),
        ...style,
      }}
    >
      {name}
    </span>
  );
}
