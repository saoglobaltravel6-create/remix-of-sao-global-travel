import aircraftVideo from "@/assets/video/aircraft-night.mp4.asset.json";
import aircraftPoster from "@/assets/video/aircraft-poster.jpg.asset.json";
import globeVideo from "@/assets/video/globe-hand.mp4.asset.json";
import globePoster from "@/assets/video/globe-poster.jpg.asset.json";

export type MediaStatus = "AVAILABLE" | "PENDING_UPLOAD";

export type VideoAsset = {
  id: string;
  /** Source desktop. Vide tant que le fichier n'est pas fourni. */
  src: string;
  /** Variante mobile allégée (optionnelle) : retombe sur `src` si absente. */
  mobileSrc?: string;
  /** Image affichée avant/à la place de la vidéo (fallback obligatoire). */
  poster: string;
  /** Description accessible de la scène. */
  description: string;
  status: MediaStatus;
};

/**
 * Registre média centralisé.
 * Pour ajouter/remplacer une vidéo : déposer le fichier, créer son pointeur
 * d'asset et mettre à jour `src` / `mobileSrc` ici. Aucun composant à réécrire.
 */
export const VIDEOS: Record<"aircraft" | "globe", VideoAsset> = {
  aircraft: {
    id: "aircraft",
    src: aircraftVideo.url,
    poster: aircraftPoster.url,
    description:
      "Avion de ligne à l'atterrissage sur une piste balisée, de nuit.",
    status: "AVAILABLE",
  },
  globe: {
    id: "globe",
    src: globeVideo.url,
    poster: globePoster.url,
    description:
      "Une main tient un globe terrestre en rotation, des avions tournent autour.",
    status: "AVAILABLE",
  },
};
