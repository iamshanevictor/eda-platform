"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "auto";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ): string;
  remove(widgetId: string): void;
  reset(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  onToken,
  resetKey,
}: {
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "upload",
      theme: "auto",
      callback: (token) => {
        setChallengeError(null);
        onToken(token);
      },
      "expired-callback": () => {
        setChallengeError("The security challenge expired. Complete it again to upload.");
        onToken("");
      },
      "error-callback": () => {
        setChallengeError("The security challenge could not load. Refresh the page and try again.");
        onToken("");
      },
    });
  }, [onToken, siteKey]);

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setChallengeError(null);
      onToken("");
    }
  }, [onToken, resetKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  if (!siteKey) {
    return (
      <p className="text-sm text-red-700 dark:text-red-300" role="alert">
        Upload security is not configured.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} aria-label="Upload security challenge" />
      {challengeError && (
        <p className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">
          {challengeError}
        </p>
      )}
    </>
  );
}
