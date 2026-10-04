import { cn } from "@/lib/utils";

/**
 * Indicateur de contenu continu pour les zones défilantes de l'écosystème SAO :
 * flou progressif + fondu sur un bord, non interactif. Le parent doit être `relative`.
 */
export function ScrollEdgeBlur({ side = "bottom", className }: { side?: "top" | "bottom" | "left" | "right"; className?: string }) {
  const dir = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" }[side];
  const pos = { top: "inset-x-0 top-0 h-10", bottom: "inset-x-0 bottom-0 h-10", left: "inset-y-0 left-0", right: "inset-y-0 right-0" }[side];
  const mask = `linear-gradient(${dir}, transparent, black 75%)`;
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-10 bg-gradient-to-r from-transparent to-background/85 backdrop-blur-[3px] motion-reduce:backdrop-blur-none", pos, className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
