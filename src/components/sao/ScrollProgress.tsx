import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let ticking = false;

    const apply = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${value})`;
      setPct(Math.round(value * 99));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[90] h-[3px] bg-transparent" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full origin-left bg-sao-gold"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>
      <span
        aria-hidden="true"
        className="fixed bottom-4 right-4 z-[90] hidden font-display text-[11px] tracking-[0.3em] text-sao-navy/60 md:block"
      >
        {pct.toString().padStart(2, "0")}
      </span>
    </>
  );
}
