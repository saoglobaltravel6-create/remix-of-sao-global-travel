import { useEffect, useRef, useState } from "react";

/**
 * Progression 0→1 d'un élément qui traverse le viewport.
 * 0 quand le haut de l'élément atteint le haut du viewport,
 * 1 quand son bas l'atteint. Calcul en requestAnimationFrame, nettoyé.
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    let active = false;

    const compute = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return setProgress(0);
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
    };

    const onScroll = () => {
      if (!active || raf) return;
      raf = requestAnimationFrame(compute);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) active = e.isIntersecting;
        if (active) onScroll();
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, progress };
}
