import {
  Plane,
  Luggage,
  Package,
  Ship,
  Bus,
  Palmtree,
  Map as MapIcon,
  Radar,
  Briefcase,
  Globe2,
  CircleDollarSign,
  Handshake,
  Info,
  Mail,
  History,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  desc: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "VOYAGER",
    items: [
      { label: "Vols", to: "/vols", desc: "Recherchez et comparez vos itinéraires.", icon: Plane },
      { label: "Bagages", to: "/bagages", desc: "Franchises, règles et préparation.", icon: Luggage },
      { label: "Bus", to: "/bus", desc: "Mobilité régionale et interurbaine.", icon: Bus },
      { label: "Destinations", to: "/destinations", desc: "Le réseau SAO, ville par ville.", icon: Globe2 },
    ],
  },
  {
    label: "EXPÉDIER",
    items: [
      { label: "Colis", to: "/colis", desc: "Envoyez à vos proches, en confiance.", icon: Package },
      { label: "Cargo", to: "/cargo", desc: "Fret aérien et solutions volume.", icon: Ship },
      { label: "Suivi", to: "/suivi", desc: "Suivez un envoi avec sa référence.", icon: Radar },
      { label: "Vols historiques", to: "/vols-historiques", desc: "Vols observés par le radar SAO.", icon: History },
      { label: "Solutions pro", to: "/solutions-pro", desc: "Entreprises, ONG et institutions.", icon: Briefcase },
    ],
  },
  {
    label: "DÉCOUVRIR",
    items: [
      { label: "Séjours", to: "/sejours", desc: "Formules complètes, vol + hébergement.", icon: Palmtree },
      { label: "Circuits", to: "/circuits", desc: "Itinéraires guidés au Tchad et ailleurs.", icon: MapIcon },
      { label: "SAO Money", to: "/saomoney", desc: "Transferts et portefeuille SAO.", icon: CircleDollarSign },
      { label: "Partenaires", to: "/partenaires", desc: "Notre écosystème et nos alliances.", icon: Handshake },
    ],
  },
  {
    label: "SAO",
    items: [
      { label: "À propos", to: "/about", desc: "Notre ADN, notre mission.", icon: Info },
      { label: "Contact", to: "/contact", desc: "Parlez à un conseiller SAO.", icon: Mail },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
