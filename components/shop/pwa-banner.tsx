"use client";

import { useEffect, useState } from "react";
import { Ms } from "@/components/stitch/ms";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaBanner() {
  const [visible, setVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone) {
      const timeoutId = window.setTimeout(() => setVisible(false));
      return () => window.clearTimeout(timeoutId);
    }

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setVisible(false);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
      setInstallPrompt(null);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    window.alert(
      isIos
        ? "Open the browser Share menu, then select “Add to Home Screen”."
        : "Open the browser menu and select “Install IndustrialX” or “Add to Home screen”."
    );
  }

  if (!visible) return null;

  return (
    <div
      className="sticky top-0 z-[60] flex items-center justify-between bg-primary px-margin-mobile py-2 text-body-sm text-white md:px-margin-desktop"
      id="pwa-banner"
    >
      <div className="flex items-center gap-2">
        <Ms name="install_mobile" className="text-[20px]" />
        <span>Install IndustrialX for faster access</span>
      </div>
      <button
        type="button"
        onClick={installApp}
        className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-primary transition-transform active:scale-95"
      >
        Install
      </button>
    </div>
  );
}
