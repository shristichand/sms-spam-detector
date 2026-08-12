"use client";

const MAX_LENGTH = 1000;

export default function MessageInput({ message, onChange, disabled, error }) {
  const count = message.length;
  const isNearLimit = count >= MAX_LENGTH * 0.9;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Enter your message
        </label>
        <span
          className={`font-mono text-xs tabular-nums ${
            isNearLimit ? "text-spam" : "text-ink-muted"
          }`}
          aria-live="polite"
        >
          {count} / {MAX_LENGTH}
        </span>
      </div>

      <textarea
        id="message"
        name="message"
        value={message}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        disabled={disabled}
        maxLength={MAX_LENGTH}
        placeholder="Type or paste a message here..."
        rows={6}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "message-error" : undefined}
        className={`w-full resize-y rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/70 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-focus-ring disabled:cursor-not-allowed disabled:bg-background disabled:text-ink-muted ${
          error ? "border-spam" : "border-border"
        }`}
      />

      {error ? (
        <p id="message-error" role="alert" className="text-sm font-medium text-spam">
          {error}
        </p>
      ) : null}
    </div>
  );
}
