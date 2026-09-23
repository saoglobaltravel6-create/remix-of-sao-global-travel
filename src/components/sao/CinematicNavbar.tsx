import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import travelLogo from "@/assets/sao-main-logo.png.asset.json";
import { Button } from "@/components/ui/button";

const HOME_LINKS = [
  { index: "01", label: "Vols", to: "/vols" },
  { index: "02", label: "Séjours", to: "/sejours" },
  { index: "03", label: "Hôtels", to: "/sejours" },
  { index: "04", label: "SAO Money", to: "/saomoney" },
] as const;

function nDjamenaTime() {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Ndjamena",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function CinematicNavbar() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("--:--:--");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const updateTime = () => setTime(nDjamenaTime());
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateTone = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 70 && rect.bottom > 70;
      });
      setDark(active?.dataset['navTone'] === "dark");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateTone);
    };
    updateTone();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const tone = dark ? "text-primary-foreground" : "text-sao-navy";

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${tone}`}>
      <div className="sao-container flex h-24 items-center justify-between gap-6">
        <Link to="/" aria-label="SAO Global Travel — accueil" className="relative z-[82] shrink-0">
          <span className="grid h-16 w-32 place-items-center overflow-hidden rounded-md bg-background/95 px-2 shadow-sm md:w-36">
            <img src={travelLogo.url} alt="SAO Global Travel" width={1536} height={1024} className="h-14 w-auto object-contain" />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigation principale">
          {HOME_LINKS.map((item) => (
            <Link key={item.index} to={item.to} className="nav-link-underline text-xs font-semibold uppercase">
              <span className="opacity-55">{item.index} /</span> {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 text-right text-[11px] font-semibold uppercase tracking-[0.08em] xl:flex">
          <a href="mailto:contact@saoglobaltravel.com" className="transition-opacity hover:opacity-65">contact@saoglobaltravel.com</a>
          <span className="w-44 tabular-nums">N'DJAMENA {time}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`relative z-[82] size-12 rounded-full border xl:hidden ${dark || open ? "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" : "border-sao-navy/25 text-sao-navy hover:bg-sao-navy/5"}`}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-6" aria-hidden="true">
            {[0, 1, 2].map((line) => (
              <span
                key={line}
                className="absolute left-0 h-px w-6 bg-current transition-transform duration-300"
                style={{
                  top: `${line * 7}px`,
                  transform: open ? (line === 0 ? "translateY(7px) rotate(45deg)" : line === 2 ? "translateY(-7px) rotate(-45deg)" : "scaleX(0)") : "none",
                }}
              />
            ))}
          </span>
        </Button>
      </div>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[81] bg-sao-navy transition-opacity duration-500 xl:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <nav className="sao-container flex min-h-svh flex-col justify-center pt-24" aria-label="Menu mobile">
          {HOME_LINKS.map((item) => (
            <Link key={item.index} to={item.to} onClick={() => setOpen(false)} className="border-b border-primary-foreground/15 py-5 text-3xl font-semibold text-primary-foreground">
              <span className="mr-4 text-sm text-sao-gold">{item.index}</span>{item.label}
            </Link>
          ))}
          <a href="mailto:contact@saoglobaltravel.com" className="mt-10 text-sm text-primary-foreground/70">contact@saoglobaltravel.com</a>
          <span className="mt-3 text-sm tabular-nums text-primary-foreground/70">N'DJAMENA {time}</span>
        </nav>
      </div>
    </header>
  );
}