/**
 * Tarifs indicatifs de référence (FCFA), relevés manuellement sur des agrégateurs publics
 * (aller-retour économique au départ de N'Djamena, nuit d'hôtel 3–4★ milieu de gamme).
 * Ce ne sont PAS des tarifs en temps réel : le prix final est vérifié à l'émission.
 */
export const FARE_SOURCE = "Tarif indicatif de référence (agrégateurs publics, 2026) — vérifié à l'émission du billet.";

export const COMMISSION = { vol: 0.05, hotel: 0.15 } as const;

const REF: Record<string, { vol: number; hotel: number }> = {
  NDJ: { vol: 0, hotel: 60000 },
  DSS: { vol: 650000, hotel: 55000 },
  ABJ: { vol: 520000, hotel: 50000 },
  DLA: { vol: 320000, hotel: 45000 },
  ADD: { vol: 480000, hotel: 50000 },
  CMN: { vol: 600000, hotel: 45000 },
  CAI: { vol: 520000, hotel: 40000 },
  CDG: { vol: 620000, hotel: 90000 },
  BRU: { vol: 640000, hotel: 80000 },
  GVA: { vol: 720000, hotel: 120000 },
  IST: { vol: 480000, hotel: 50000 },
  DXB: { vol: 450000, hotel: 70000 },
  DOH: { vol: 470000, hotel: 65000 },
  JED: { vol: 420000, hotel: 55000 },
  CAN: { vol: 780000, hotel: 40000 },
  BOM: { vol: 650000, hotel: 40000 },
  BKK: { vol: 760000, hotel: 30000 },
  KUL: { vol: 780000, hotel: 30000 },
};

export const CLASS_FACTOR: Record<string, number> = {
  "Économique": 1,
  "Premium économique": 1.6,
  "Affaires": 3,
  "Première": 5,
};

export function quote(iata: string, classe: string, passagers: number, nuits: number) {
  const r = REF[iata];
  if (!r) return null;
  const vol = Math.round(r.vol * (CLASS_FACTOR[classe] ?? 1) * passagers * (1 + COMMISSION.vol));
  const hotel = Math.round(r.hotel * Math.max(0, nuits) * (1 + COMMISSION.hotel));
  return { vol, hotel, total: vol + hotel };
}

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
