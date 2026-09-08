"use client";

import { useState } from "react";

export function PasswordInput({
  name,
  required,
  minLength,
}: {
  name: string;
  required?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        className="w-full bg-surface border border-ink/15 rounded-full pl-[18px] pr-11 py-[13px] shadow-sm text-[13.5px]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          {visible ? (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24" />
              <path d="M9.9 4.24A11 11 0 0 1 12 4c7 0 11 7 11 7a13.6 13.6 0 0 1-3.06 3.94M6.1 6.1C3.5 7.9 1 12 1 12s4 7 11 7a10.6 10.6 0 0 0 5-1.2" />
            </>
          ) : (
            <>
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
