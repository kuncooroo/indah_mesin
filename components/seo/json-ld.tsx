type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Safe JSON-LD script for structured data (escapes `<` to avoid XSS). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
