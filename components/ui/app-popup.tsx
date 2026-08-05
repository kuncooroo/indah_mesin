"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

type PopupTone = "success" | "error" | "info" | "confirm";

type PopupState = {
  tone: PopupTone;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type AppPopupContextValue = {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (options: {
    message: string;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => Promise<boolean>;
};

const AppPopupContext = createContext<AppPopupContextValue | null>(null);

export function AppPopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [confirmResolver, setConfirmResolver] = useState<((value: boolean) => void) | null>(
    null
  );
  const titleId = useId();

  const close = useCallback(() => {
    setPopup(null);
    setConfirmResolver(null);
  }, []);

  const finishConfirm = useCallback(
    (result: boolean) => {
      confirmResolver?.(result);
      setConfirmResolver(null);
      setPopup(null);
    },
    [confirmResolver]
  );

  const showSuccess = useCallback((message: string, title = "Success") => {
    setPopup({ tone: "success", title, message });
  }, []);

  const showError = useCallback((message: string, title = "Something went wrong") => {
    setPopup({ tone: "error", title, message });
  }, []);

  const showInfo = useCallback((message: string, title = "Notice") => {
    setPopup({ tone: "info", title, message });
  }, []);

  const showConfirm = useCallback(
    (options: {
      message: string;
      title?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    }) =>
      new Promise<boolean>((resolve) => {
        setConfirmResolver(() => resolve);
        setPopup({
          tone: "confirm",
          title: options.title ?? "Please confirm",
          message: options.message,
          confirmLabel: options.confirmLabel ?? "Confirm",
          cancelLabel: options.cancelLabel ?? "Cancel",
        });
      }),
    []
  );

  useEffect(() => {
    if (!popup) return;
    const current = popup;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (current.tone === "confirm") finishConfirm(false);
      else close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popup, close, finishConfirm]);

  const value = useMemo(
    () => ({ showSuccess, showError, showInfo, showConfirm }),
    [showSuccess, showError, showInfo, showConfirm]
  );

  const icon =
    popup?.tone === "success"
      ? "check_circle"
      : popup?.tone === "error"
        ? "error"
        : popup?.tone === "confirm"
          ? "help"
          : "info";

  const iconClass =
    popup?.tone === "success"
      ? "text-status-ready"
      : popup?.tone === "error"
        ? "text-error"
        : popup?.tone === "confirm"
          ? "text-status-indent"
          : "text-primary";

  return (
    <AppPopupContext.Provider value={value}>
      {children}
      {popup ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px]"
            onClick={() => {
              if (popup.tone === "confirm") finishConfirm(false);
              else close();
            }}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
          >
            <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-8 text-center">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  popup.tone === "success" && "bg-secondary-container/40",
                  popup.tone === "error" && "bg-error-container/60",
                  popup.tone === "info" && "bg-primary/10",
                  popup.tone === "confirm" && "bg-status-indent/15"
                )}
              >
                <MaterialSymbol name={icon} className={cn("text-[32px]", iconClass)} />
              </div>
              <h2 id={titleId} className="font-headline-md text-lg font-bold text-on-surface">
                {popup.title}
              </h2>
              <p className="text-body-sm text-on-surface-variant">{popup.message}</p>
            </div>
            <div className="flex gap-2 border-t border-border-subtle p-4">
              {popup.tone === "confirm" ? (
                <>
                  <button
                    type="button"
                    onClick={() => finishConfirm(false)}
                    className="h-11 flex-1 rounded-xl bg-surface-container-high font-button-text text-on-surface"
                  >
                    {popup.cancelLabel ?? "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => finishConfirm(true)}
                    className="h-11 flex-1 rounded-xl bg-primary font-button-text text-on-primary"
                  >
                    {popup.confirmLabel ?? "Confirm"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    "h-11 w-full rounded-xl font-button-text text-on-primary",
                    popup.tone === "error" ? "bg-error" : "bg-primary"
                  )}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AppPopupContext.Provider>
  );
}

export function useAppPopup() {
  const ctx = useContext(AppPopupContext);
  if (!ctx) {
    throw new Error("useAppPopup must be used within AppPopupProvider");
  }
  return ctx;
}
