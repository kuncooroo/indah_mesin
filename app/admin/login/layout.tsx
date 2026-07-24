export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900 antialiased">
      {children}
    </div>
  );
}
