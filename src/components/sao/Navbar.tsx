import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown, UserRound } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/sao-logo.png.asset.json";

const LINKS = [
  { label: "ACCUEIL", to: "/" },
  { label: "VOLS", to: "/", hash: "moteur" },
  { label: "SERVICES", to: "/", hash: "services" },
  { label: "DESTINATIONS", to: "/", hash: "destinations" },
  { label: "SUIVI", to: "/", hash: "suivi" },
  { label: "SAO MONEY", to: "/", hash: "sao-money" },
  { label: "À PROPOS", to: "/", hash: "adn" },
  { label: "CONTACT", to: "/", hash: "contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="sao-container flex items-center justify-between gap-4 py-5 lg:py-7">
        <Link to="/" className="shrink-0" aria-label="SAO Global Travel — accueil">
          <img
            src={logo.url}
            alt="SAO Global Travel"
            width={200}
            height={132}
            className="h-12 w-auto lg:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="nav-link-underline text-[13px] font-semibold tracking-wide text-sao-navy"
            >
              {l.label}
            </Link>
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
          <button
            type="button"
            className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-sao-navy lg:inline-flex"
          >
            FR <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
          <Link
            to="/connexion"
            className="hidden items-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-[13px] font-semibold tracking-wide text-primary-foreground transition-[filter] duration-200 hover:brightness-125 md:inline-flex"
          >
            <UserRound className="size-4" aria-hidden="true" /> ESPACE CLIENT
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

      <div
        className="grid overflow-hidden px-[18px] transition-[grid-template-rows] duration-[420ms] xl:hidden"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "var(--ease-spring)",
        }}
      >
        <div className="min-h-0">
          <div className="mb-4 rounded-3xl border border-border bg-background p-6 shadow-[var(--shadow-float)]">
            <ul className="flex flex-col gap-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    hash={l.hash}
                    onClick={() => setOpen(false)}
                    className="block text-[28px] leading-8 font-semibold tracking-[-0.84px] text-sao-navy"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/connexion"
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
