import afrique from "@/assets/dest-afrique.jpg";
import europe from "@/assets/dest-europe.jpg";
import moyenOrient from "@/assets/dest-moyen-orient.jpg";
import asie from "@/assets/dest-asie.jpg";

export type Zone = "Afrique" | "Europe" | "Moyen-Orient" | "Asie";

export type Destination = {
  city: string;
  country: string;
  zone: Zone;
  /** Aéroport principal desservant la ville. */
  airport: string;
  /** Code IATA officiel de l'aéroport. */
  iata: string;
  /** Coordonnées approximatives de l'aéroport (degrés décimaux). */
  lat: number;
  lng: number;
  description: string;
  image: string;
};

export const ZONE_IMAGE: Record<Zone, string> = {
  Afrique: afrique,
  Europe: europe,
  "Moyen-Orient": moyenOrient,
  Asie: asie,
};

/**
 * Destinations réelles : ville, pays, aéroport, code IATA et coordonnées
 * approximatives de l'aéroport. Aucune donnée tarifaire ni horaire n'est
 * indiquée ici tant qu'elle n'est pas fournie par une source réelle.
 */
export const DESTINATIONS: Destination[] = [
  {
    city: "N'Djamena",
    country: "Tchad",
    zone: "Afrique",
    airport: "Aéroport international Hassan Djamous",
    iata: "NDJ",
    lat: 12.13,
    lng: 15.03,
    description: "Notre port d'attache, capitale du Tchad et porte d'entrée du Sahel.",
    image: afrique,
  },
  {
    city: "Dakar",
    country: "Sénégal",
    zone: "Afrique",
    airport: "Aéroport international Blaise Diagne",
    iata: "DSS",
    lat: 14.67,
    lng: -17.07,
    description: "Notre seconde base, hub de l'Afrique de l'Ouest sur l'Atlantique.",
    image: afrique,
  },
  {
    city: "Abidjan",
    country: "Côte d'Ivoire",
    zone: "Afrique",
    airport: "Aéroport international Félix-Houphouët-Boigny",
    iata: "ABJ",
    lat: 5.26,
    lng: -3.93,
    description: "Capitale économique ivoirienne, place forte du commerce régional.",
    image: afrique,
  },
  {
    city: "Douala",
    country: "Cameroun",
    zone: "Afrique",
    airport: "Aéroport international de Douala",
    iata: "DLA",
    lat: 4.01,
    lng: 9.72,
    description: "Principal port du Golfe de Guinée, essentiel pour le fret vers le Tchad.",
    image: afrique,
  },
  {
    city: "Addis-Abeba",
    country: "Éthiopie",
    zone: "Afrique",
    airport: "Aéroport international de Bole",
    iata: "ADD",
    lat: 8.98,
    lng: 38.8,
    description: "Grand hub de correspondance du continent africain.",
    image: afrique,
  },
  {
    city: "Casablanca",
    country: "Maroc",
    zone: "Afrique",
    airport: "Aéroport Mohammed V",
    iata: "CMN",
    lat: 33.37,
    lng: -7.59,
    description: "Passerelle historique entre l'Afrique, l'Europe et l'Amérique.",
    image: afrique,
  },
  {
    city: "Le Caire",
    country: "Égypte",
    zone: "Afrique",
    airport: "Aéroport international du Caire",
    iata: "CAI",
    lat: 30.11,
    lng: 31.41,
    description: "Carrefour entre l'Afrique du Nord et le Moyen-Orient.",
    image: afrique,
  },
  {
    city: "Paris",
    country: "France",
    zone: "Europe",
    airport: "Aéroport Paris-Charles-de-Gaulle",
    iata: "CDG",
    lat: 49.01,
    lng: 2.55,
    description: "Première porte d'entrée européenne pour la diaspora tchadienne.",
    image: europe,
  },
  {
    city: "Bruxelles",
    country: "Belgique",
    zone: "Europe",
    airport: "Aéroport de Bruxelles-National",
    iata: "BRU",
    lat: 50.9,
    lng: 4.48,
    description: "Capitale institutionnelle européenne, utile aux voyages officiels.",
    image: europe,
  },
  {
    city: "Genève",
    country: "Suisse",
    zone: "Europe",
    airport: "Aéroport de Genève",
    iata: "GVA",
    lat: 46.24,
    lng: 6.11,
    description: "Siège de nombreuses organisations internationales et ONG.",
    image: europe,
  },
  {
    city: "Istanbul",
    country: "Turquie",
    zone: "Moyen-Orient",
    airport: "Aéroport d'Istanbul",
    iata: "IST",
    lat: 41.26,
    lng: 28.74,
    description: "Hub majeur entre l'Europe, l'Afrique et l'Asie.",
    image: moyenOrient,
  },
  {
    city: "Dubaï",
    country: "Émirats arabes unis",
    zone: "Moyen-Orient",
    airport: "Aéroport international de Dubaï",
    iata: "DXB",
    lat: 25.25,
    lng: 55.36,
    description: "Plaque tournante du commerce, du fret et des affaires.",
    image: moyenOrient,
  },
  {
    city: "Doha",
    country: "Qatar",
    zone: "Moyen-Orient",
    airport: "Aéroport international Hamad",
    iata: "DOH",
    lat: 25.27,
    lng: 51.61,
    description: "Correspondances rapides vers l'Asie et l'Océanie.",
    image: moyenOrient,
  },
  {
    city: "Djeddah",
    country: "Arabie saoudite",
    zone: "Moyen-Orient",
    airport: "Aéroport international Roi Abdulaziz",
    iata: "JED",
    lat: 21.68,
    lng: 39.16,
    description: "Point d'entrée pour les voyages religieux vers La Mecque.",
    image: moyenOrient,
  },
  {
    city: "Guangzhou",
    country: "Chine",
    zone: "Asie",
    airport: "Aéroport international de Baiyun",
    iata: "CAN",
    lat: 23.39,
    lng: 113.3,
    description: "Destination clé des importateurs et du fret aérien.",
    image: asie,
  },
  {
    city: "Mumbai",
    country: "Inde",
    zone: "Asie",
    airport: "Aéroport international Chhatrapati-Shivaji",
    iata: "BOM",
    lat: 19.09,
    lng: 72.87,
    description: "Santé, commerce et industrie sur la côte ouest indienne.",
    image: asie,
  },
  {
    city: "Bangkok",
    country: "Thaïlande",
    zone: "Asie",
    airport: "Aéroport de Suvarnabhumi",
    iata: "BKK",
    lat: 13.69,
    lng: 100.75,
    description: "Séjours, soins et négoce en Asie du Sud-Est.",
    image: asie,
  },
  {
    city: "Kuala Lumpur",
    country: "Malaisie",
    zone: "Asie",
    airport: "Aéroport international de Kuala Lumpur",
    iata: "KUL",
    lat: 2.75,
    lng: 101.71,
    description: "Hub asiatique alternatif, apprécié pour les longs séjours.",
    image: asie,
  },
];

export const ZONES: Zone[] = ["Afrique", "Europe", "Moyen-Orient", "Asie"];
