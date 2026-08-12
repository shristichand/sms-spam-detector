import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Spam Detector
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted sm:text-base">
          Detect whether a message is spam using machine learning.
        </p>
      </div>
    </header>
  );
}
