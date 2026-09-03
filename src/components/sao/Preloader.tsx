import { useEffect, useState } from "react";
import logo from "@/assets/sao-logo.png.asset.json";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.documentElement.dataset['saoReady'] = "true";
      setGone(true);
      return;
    }

    let value = 0;
    const tick = window.setInterval(() => {
      value = Math.min(100, value + Math.random() * 14 + 6);
      setProgress(Math.round(value));
      if (value >= 100) {
        window.clearInterval(tick);
        window.setTimeout(() => setLifting(true), 260);
        window.setTimeout(() => {
          document.documentElement.dataset['saoReady'] = "true";
          setGone(true);
        }, 1180);
      }
    }, 110);

    return () => window.clearInterval(tick);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sao-navy"
      style={{
        transform: lifting ? "translateY(-101%)" : "translateY(0)",
        transition: "transform 900ms var(--ease-spring)",
      }}
    >
      <img
        src={logo.url}
        alt=""
        width={200}
        height={132}
        className="h-20 w-auto"
        style={{ animation: "fadeInSoft 0.7s var(--ease-soft) both" }}
      />
      <div className="mt-8 h-px w-40 overflow-hidden bg-sao-ivory/20">
        <div
          className="h-full bg-sao-gold"
          style={{ width: `${progress}%`, transition: "width 160ms linear" }}
        />
      </div>
      <span className="mt-4 font-display text-xs tracking-[0.35em] text-sao-ivory/70">
        {progress.toString().padStart(3, "0")}%
      </span>
    </div>
  );
}
