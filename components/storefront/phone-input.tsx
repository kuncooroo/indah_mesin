"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FieldError, FieldHint, inputErrorClass } from "@/components/ui/form-feedback";
import {
  COUNTRY_DIAL_CODES,
  findCountryByDial,
  formatInternationalPhone,
  parseStoredPhone,
} from "@/lib/storefront/country-dial-codes";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  value: string;
  onChange: (internationalPhone: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  showHint?: boolean;
};

export function PhoneInput({
  value,
  onChange,
  error,
  disabled,
  required = true,
  id,
  name,
  showHint = true,
}: PhoneInputProps) {
  const parsed = parseStoredPhone(value);
  const [dial, setDial] = useState(parsed.dial);
  const [national, setNational] = useState(parsed.national);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = parseStoredPhone(value);
    setDial(next.dial);
    setNational(next.national);
  }, [value]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const country = findCountryByDial(dial);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.dial.includes(q) ||
        item.code.toLowerCase().includes(q)
    );
  }, [query]);

  function emit(nextDial: string, nextNational: string) {
    onChange(formatInternationalPhone(nextDial, nextNational));
  }

  return (
    <div ref={rootRef} className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-12 min-w-[7.5rem] items-center justify-between gap-1 rounded-xl border border-transparent bg-surface-container px-3 font-label-technical text-on-surface outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
              inputErrorClass(Boolean(error))
            )}
            aria-label="Select country code"
          >
            <span>
              {country.flag} +{country.dial}
            </span>
            <span className="text-outline">▾</span>
          </button>
          {open ? (
            <div className="absolute z-30 mt-1 w-64 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-xl">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search country"
                className="h-10 w-full border-b border-border-subtle bg-transparent px-3 text-sm outline-none"
              />
              <ul className="max-h-52 overflow-auto">
                {filtered.map((item) => (
                  <li key={`${item.code}-${item.dial}`}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-container"
                      onClick={() => {
                        setDial(item.dial);
                        setOpen(false);
                        setQuery("");
                        emit(item.dial, national);
                      }}
                    >
                      <span>{item.flag}</span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-on-surface-variant">+{item.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <input
          id={id}
          name={name}
          type="tel"
          inputMode="tel"
          disabled={disabled}
          value={national}
          aria-invalid={Boolean(error)}
          placeholder="81234567890"
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d\s-]/g, "");
            setNational(next);
            emit(dial, next);
          }}
          className={cn(
            "h-12 flex-1 rounded-xl border border-transparent bg-surface-container px-4 font-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary/20 disabled:opacity-60",
            inputErrorClass(Boolean(error))
          )}
        />
      </div>
      {showHint ? (
        <FieldHint message="Select your country code, then enter the number without the leading 0." />
      ) : null}
      <FieldError message={error} />
    </div>
  );
}

export function UncontrolledPhoneFields({
  defaultValue,
  error,
  name = "phone",
}: {
  defaultValue?: string;
  error?: string;
  name?: string;
}) {
  const parsed = parseStoredPhone(defaultValue);
  const [dial, setDial] = useState(parsed.dial);
  const [national, setNational] = useState(parsed.national);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const country = findCountryByDial(dial);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.dial.includes(q) ||
        item.code.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div ref={rootRef} className="space-y-1.5">
      <input type="hidden" name={name} value={formatInternationalPhone(dial, national)} />
      <div className="flex gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-12 min-w-[7.5rem] items-center justify-between gap-1 rounded-lg border border-transparent bg-surface-container-lowest px-3 font-label-technical text-on-surface"
          >
            <span>
              {country.flag} +{country.dial}
            </span>
            <span className="text-outline">▾</span>
          </button>
          {open ? (
            <div className="absolute z-30 mt-1 w-64 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-xl">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search country"
                className="h-10 w-full border-b border-border-subtle bg-transparent px-3 text-sm outline-none"
              />
              <ul className="max-h-52 overflow-auto">
                {filtered.map((item) => (
                  <li key={`${item.code}-${item.dial}`}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-container"
                      onClick={() => {
                        setDial(item.dial);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <span>{item.flag}</span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-on-surface-variant">+{item.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <input
          type="tel"
          inputMode="tel"
          value={national}
          aria-invalid={Boolean(error)}
          placeholder="81234567890"
          onChange={(event) => setNational(event.target.value.replace(/[^\d\s-]/g, ""))}
          className={cn(
            "h-12 flex-1 rounded-lg border border-transparent bg-surface-container-lowest px-4 outline-none focus:ring-2 focus:ring-primary/20",
            inputErrorClass(Boolean(error))
          )}
        />
      </div>
      <FieldHint message="Select your country code, then enter the number without the leading 0." />
      <FieldError message={error} />
    </div>
  );
}
