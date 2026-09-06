import { useEffect, useRef, useState } from "react";

/** Curseur doré desktop uniquement (souris fine + motion autorisée). */
export function GoldCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [role='button'], input, select, textarea, [data-cursor]"
      );
      setActive(!!el);
      setLabel(el?.dataset['cursor'] ?? "");
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      visible = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("has-gold-cursor");

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-gold-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden opacity-0 xl:block"
      style={{ transition: "opacity 220ms linear", willChange: "transform" }}
    >
      <div
        className="grid place-items-center rounded-full border border-sao-gold"
        style={{
          width: active ? 62 : 26,
          height: active ? 62 : 26,
          backgroundColor: active ? "color-mix(in oklab, var(--sao-gold) 16%, transparent)" : "transparent",
          transition: "width 280ms var(--ease-spring), height 280ms var(--ease-spring), background-color 280ms linear",
        }}
      >
        {active && label ? (
          <span className="text-[9px] font-bold tracking-[0.12em] text-sao-navy">{label}</span>
        ) : null}
      </div>
    </div>
  );
}
