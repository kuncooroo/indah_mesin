"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppPopup } from "@/components/ui/app-popup";

const MESSAGES: Record<string, string> = {
  account: "Account changes saved successfully.",
  business: "Business identity saved successfully.",
};

export function ProfileSavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess } = useAppPopup();

  useEffect(() => {
    const saved = searchParams.get("saved");
    if (!saved || !MESSAGES[saved]) return;
    showSuccess(MESSAGES[saved]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("saved");
    const next = params.toString();
    router.replace(next ? `/profile?${next}` : "/profile");
  }, [router, searchParams, showSuccess]);

  return null;
}
