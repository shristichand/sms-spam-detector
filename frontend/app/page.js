"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import MessageInput from "@/components/MessageInput";
import PredictionResult from "@/components/PredictionResult";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const CONNECTION_ERROR =
  "Unable to connect to the spam detection server. Please make sure the backend is running.";
const GENERIC_ERROR = "Something went wrong while checking that message. Please try again.";
const EMPTY_MESSAGE_ERROR = "Please enter a message to check.";

export default function Home() {
  const [message, setMessage] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (value) => {
      setMessage(value);
      if (validationError) setValidationError("");
      if (apiError) setApiError("");
    },
    [validationError, apiError]
  );

  const handleClear = useCallback(() => {
    setMessage("");
    setPrediction(null);
    setValidationError("");
    setApiError("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isLoading) return; // guard against duplicate/simultaneous submissions

    const trimmed = message.trim();
    if (!trimmed) {
      setPrediction(null);
      setApiError("");
      setValidationError(EMPTY_MESSAGE_ERROR);
      return;
    }

    setValidationError("");
    setApiError("");
    setPrediction(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        setApiError(GENERIC_ERROR);
        return;
      }

      const data = await response.json();

      if (data?.prediction === "spam" || data?.prediction === "not spam") {
        setPrediction(data.prediction);
      } else {
        setApiError(GENERIC_ERROR);
      }
    } catch {
      // Covers network failures and a backend that isn't running (fetch throws
      // a TypeError in that case rather than resolving with a response).
      setApiError(CONNECTION_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading]);

  const handleKeyDown = (e) => {
    // Cmd/Ctrl+Enter submits from within the textarea without leaving the keyboard.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <main className="flex w-full max-w-[720px] flex-col gap-8">
        <Header />

        <div
          className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          onKeyDown={handleKeyDown}
        >
          <MessageInput
            message={message}
            onChange={handleChange}
            disabled={isLoading}
            error={validationError}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Checking...
                </>
              ) : (
                "Check Message"
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>
          </div>

          {apiError ? (
            <p role="alert" className="text-sm font-medium text-spam">
              {apiError}
            </p>
          ) : null}
        </div>

        <PredictionResult prediction={prediction} />
      </main>
    </div>
  );
}
