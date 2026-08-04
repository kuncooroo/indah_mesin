import { Suspense } from "react";

import BusinessIdentityClient from "./business-identity-client";

export default function BusinessIdentityPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pb-24 pt-16">
          <div className="space-y-4 px-4 py-8">
            <div className="h-48 animate-pulse rounded-xl bg-surface-container" />
            <div className="h-64 animate-pulse rounded-xl bg-surface-container" />
          </div>
        </main>
      }
    >
      <BusinessIdentityClient />
    </Suspense>
  );
}
