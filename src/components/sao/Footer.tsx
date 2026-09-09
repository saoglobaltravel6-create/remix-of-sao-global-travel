import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import travelLogo from "@/assets/sao-global-travel-official.png.asset.json";
import { Marquee } from "@/components/sao/Marquee";
import { NAV_GROUPS } from "@/lib/site-nav";

export function Footer() {
  return (
    <footer id="contact" className="bg-sao-navy text-primary-foreground">
      <Marquee />
      <div className="sao-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-2xl bg-background p-3">
            <img
              src={travelLogo.url}
              alt="SAO Global Travel"
              width={1087}
              height={585}
              className="h-16 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm text-primary-foreground/75">
            Une marque africaine, ouverte sur le monde. Votre partenaire de confiance pour voyager,
            expédier, transférer et découvrir.
          </p>
          <Link
            to="/connexion"
            className="mt-5 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy transition-[filter] duration-200 hover:brightness-105"
          >
            Espace client
          </Link>
        </div>

        {NAV_GROUPS.slice(0, 3).map((g) => (
          <div key={g.label}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sao-gold">{g.label}</h3>
            <ul className="mt-5 grid gap-2 text-sm text-primary-foreground/80">
              {g.items.map((i) => (
                <li key={i.to}>
                  <Link to={i.to as "/"} className="hover:text-sao-gold">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sao-container grid gap-8 border-t border-primary-foreground/15 py-10 md:grid-cols-2">
        <ul className="space-y-3 text-sm text-primary-foreground/80">
          <li className="flex items-center gap-2">
            <Phone className="size-4 text-sao-gold" aria-hidden="true" />
            <a href="tel:+23566288649">+235 66 28 86 49 (Tchad)</a>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="size-4 text-sao-gold" aria-hidden="true" />
            <a href="tel:+221777308535">+221 77 730 85 35 (Sénégal)</a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="size-4 text-sao-gold" aria-hidden="true" />
            <a href="mailto:contact@saoglobaltravel.com">contact@saoglobaltravel.com</a>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-sao-gold" aria-hidden="true" />
            N'Djamena, Tchad · Dakar, Sénégal
          </li>
        </ul>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80 md:justify-end">
          <Link to="/about" className="hover:text-sao-gold">À propos</Link>
          <Link to="/partenaires" className="hover:text-sao-gold">Partenaires</Link>
          <Link to="/solutions-pro" className="hover:text-sao-gold">Solutions professionnelles</Link>
          <Link to="/contact" className="hover:text-sao-gold">Contact</Link>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="sao-container flex flex-col gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>Voyagez. Découvrez. Connectez le monde.</p>
          <p>© 2026 SAO Global Travel. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
