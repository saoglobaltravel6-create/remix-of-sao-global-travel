import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown, UserRound } from "lucide-react";
import { useState } from "react";
import travelLogo from "@/assets/sao-logo-color.png.asset.json";
import { NAV_GROUPS } from "@/lib/site-nav";
import { useAuth } from "@/hooks/use-auth";

type Props = {
  /** Barre opaque et collante (pages internes) plutôt que superposée au hero. */
  solid?: boolean;
};

export function Navbar({ solid = false }: Props) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const { user } = useAuth();
  const espaceTo = (user ? "/espace-client" : "/connexion") as "/";

  return (
    <header
      className={
        solid
          ? "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"
          : "absolute inset-x-0 top-0 z-30"
      }
      onMouseLeave={() => setMega(null)}
    >
      <div className="sao-container flex items-center justify-between gap-4 py-4 lg:py-5">
        <Link to="/" className="shrink-0" aria-label="SAO Global Travel — accueil">
          <img
            src={travelLogo.url}
            alt="SAO Global Travel"
            width={1403}
            height={848}
            className="h-14 w-auto object-contain lg:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          <Link
            to="/"
            className="nav-link-underline text-[13px] font-semibold tracking-wide text-sao-navy"
          >
            ACCUEIL
          </Link>
          {NAV_GROUPS.map((g) => (
            <button
              key={g.label}
              type="button"
              onMouseEnter={() => setMega(g.label)}
              onFocus={() => setMega(g.label)}
              onClick={() => setMega((v) => (v === g.label ? null : g.label))}
              aria-expanded={mega === g.label}
              className="nav-link-underline inline-flex items-center gap-1 text-[13px] font-semibold tracking-wide text-sao-navy"
            >
              {g.label}
              <ChevronDown className="size-3.5 text-sao-gold" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+23566288649"
            className="hidden items-center gap-2 text-sm font-medium text-sao-navy lg:inline-flex"
          >
            <Phone className="size-4 text-sao-gold" aria-hidden="true" />
            +235 66 28 86 49
          </a>
          <Link
            to={espaceTo}
            aria-label="Espace client"
            className="inline-flex items-center gap-2 rounded-full bg-sao-navy p-2.5 text-[13px] font-semibold tracking-wide text-primary-foreground transition-[filter] duration-200 hover:brightness-125 md:px-5 md:py-3"
          >
            <UserRound className="size-4" aria-hidden="true" />
            <span className="hidden md:inline">ESPACE CLIENT</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="rounded-full border border-border bg-background/80 p-2.5 text-sao-navy xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mega-menu desktop */}
      {mega && (
        <div className="hidden xl:block">
          <div className="sao-container pb-4">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-[var(--shadow-float)]">
              <div className="grid grid-cols-4 gap-4">
                {NAV_GROUPS.find((g) => g.label === mega)!.items.map(
                  ({ icon: Icon, ...item }) => (
                    <Link
                      key={item.to}
                      to={item.to as "/"}
                      onClick={() => setMega(null)}
                      className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-sao-ivory"
                    >
                      <span className="rounded-xl bg-sao-ivory p-2 text-sao-navy transition-colors group-hover:bg-sao-gold/25">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-sao-navy">{item.label}</span>
                        <span className="block text-xs text-muted-foreground">{item.desc}</span>
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu mobile */}
      <div
        className="grid overflow-hidden px-[18px] transition-[grid-template-rows] duration-[420ms] xl:hidden"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "var(--ease-spring)",
        }}
      >
        <div className="min-h-0">
          <div className="mb-4 max-h-[70svh] overflow-y-auto rounded-3xl border border-border bg-background p-5 shadow-[var(--shadow-float)]">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block py-2 text-lg font-bold text-sao-navy"
            >
              Accueil
            </Link>
            {NAV_GROUPS.map((g) => (
              <div key={g.label} className="mt-4">
                <p className="text-[11px] font-bold tracking-[0.18em] text-sao-gold">{g.label}</p>
                <ul className="mt-2 grid gap-1">
                  {g.items.map(({ icon: Icon, ...item }) => (
                    <li key={item.to}>
                      <Link
                        to={item.to as "/"}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-base font-semibold text-sao-navy active:bg-sao-ivory"
                      >
                        <Icon className="size-4 text-sao-gold" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to={espaceTo}
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <UserRound className="size-4" aria-hidden="true" /> Espace client
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
