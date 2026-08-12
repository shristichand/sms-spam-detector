"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

export default function PredictionResult({ prediction }) {
  if (!prediction) return null;

  const isSpam = prediction === "spam";

  const config = isSpam
    ? {
      label: "SPAM",
      supportingText: "This message appears to be spam.",
      Icon: AlertTriangle,
      textColor: "text-spam",
      bg: "bg-spam-bg",
      border: "border-spam-border",
      iconWrap: "bg-spam text-white",
    }
    : {
      label: "NOT SPAM",
      supportingText: "This message appears to be legitimate.",
      Icon: CheckCircle,
      textColor: "text-ham",
      bg: "bg-ham-bg",
      border: "border-ham-border",
      iconWrap: "bg-ham text-white",
    };

  const { label, supportingText, Icon, textColor, bg, border, iconWrap } = config;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center gap-3 rounded-xl border ${border} ${bg} px-6 py-7 text-center`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconWrap}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className={`text-2xl font-bold tracking-wide ${textColor}`}>
        {label}
      </span>
      <p className="text-sm text-ink-muted">{supportingText}</p>
    </div>
  );
}
