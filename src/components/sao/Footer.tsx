import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/sao-logo.png.asset.json";

const SERVICES = [
  "Vols",
  "Bagages",
  "Colis",
  "Cargo",
  "Bus",
  "SAO Money",
  "Hébergements",
  "Séjours & Circuits",
  "Suivi",
  "Solutions Professionnelles",
];

export function Footer() {
  return (
    <footer id="contact" className="bg-sao-navy text-primary-foreground">
      <div className="sao-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-2xl bg-background p-3">
            <img src={logo.url} alt="SAO Global Travel" width={220} height={145} className="h-16 w-auto" loading="lazy" />
          </div>
          <p className="mt-5 max-w-xs text-sm text-primary-foreground/75">
            Une marque africaine, ouverte sur le monde. Votre partenaire de confiance pour voyager,
            expédier, transférer et découvrir.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-sao-gold">Nos services</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
            {SERVICES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-sao-gold">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
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
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-sao-gold">
            Prêt à partir ?
          </h3>
          <p className="mt-5 text-sm text-primary-foreground/80">
            Parlons de votre prochain voyage, envoi, transfert ou cargo. Nos conseillers répondent
            du lundi au samedi.
          </p>
          <Link
            to="/connexion"
            className="mt-5 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy transition-[filter] duration-200 hover:brightness-105"
          >
            Contacter un conseiller
          </Link>
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
