import { useEffect, useRef, useState } from "react";

const COUPON_CODE = "CCFORSFDEEP";
const STORAGE_KEY = "promobar_dismissed";
const BAR_HEIGHT = "32px";

function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function PromoBar() {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {
      /* sessionStorage unavailable (private mode, etc.) — keep visible */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--promo-bar-h", dismissed ? "0px" : BAR_HEIGHT);
    return () => {
      root.style.setProperty("--promo-bar-h", "0px");
    };
  }, [dismissed]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const handleCopy = () => {
    copyText(COUPON_CODE).then((ok) => {
      if (!ok) return;
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="promo-bar" role="region" aria-label="Discount offer">
      <span className="promo-bar-text">
        <strong className="promo-bar-amount">$30 off</strong>
        <span className="promo-bar-sep" aria-hidden="true">·</span>
        <span className="promo-bar-label">code</span>
      </span>
      <button
        type="button"
        className="promo-bar-code"
        data-copied={copied ? "true" : "false"}
        onClick={handleCopy}
        aria-label={copied ? "Coupon code copied" : `Copy coupon code ${COUPON_CODE}`}
      >
        <span className="promo-bar-code-text">{COUPON_CODE}</span>
        <ClipboardIcon copied={copied} />
      </button>
      <span className="promo-bar-toast" role="status" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
      <button
        type="button"
        className="promo-bar-close"
        onClick={handleDismiss}
        aria-label="Dismiss discount banner"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

function ClipboardIcon({ copied }) {
  if (copied) {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.5" y="2.5" width="8" height="10" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 5.2v7.6c0 .9.7 1.7 1.6 1.7H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
