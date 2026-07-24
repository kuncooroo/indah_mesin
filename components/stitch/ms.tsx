import { cn } from "@/lib/utils";

type MsProps = {
  name: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
};

export function Ms({ name, className, fill, style }: MsProps) {
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
