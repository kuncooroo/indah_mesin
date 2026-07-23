"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("indah_mesin_session");
    if (!session) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-scada-primary">
        <Loader2 className="size-8 animate-spin text-scada-cyan" />
      </div>
    );
  }

  return <>{children}</>;
}
