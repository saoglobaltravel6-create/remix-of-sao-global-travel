import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Bus,
  CircleDollarSign,
  LogOut,
  Luggage,
  Map as MapIcon,
  Package,
  Palmtree,
  Plane,
  Radar,
  Ship,
  Briefcase,
} from "lucide-react";
import { PageShell, Section, DemoNote } from "@/components/sao/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/hooks/use-auth";
import hero from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/espace-client")({
  head: () => ({
    meta: [
      { title: "Mon espace client — Demandes, envois et SAO Money | SAO Global Travel" },
      {
        name: "description",
        content:
          "Retrouvez vos demandes de vols, colis, cargo, bus, séjours et circuits, le suivi de vos envois et vos opérations SAO Money.",
      },
      { property: "og:title", content: "Mon espace client — SAO Global Travel" },
      {
        property: "og:description",
        content: "Vos demandes, vos envois et vos opérations SAO Money au même endroit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EspaceClient,
});

type Req = {
  id: string;
  service: string;
  reference: string;
  status: string;
  created_at: string;
  details: Record<string, string> | null;
};
type Shipment = { id: string; reference: string; status: string; origin: string | null; destination: string | null; is_demo: boolean };
type Wallet = { balance: number; currency: string };

const SERVICES = [
  { label: "Vols", to: "/vols", icon: Plane },
  { label: "Bagages", to: "/bagages", icon: Luggage },
  { label: "Colis", to: "/colis", icon: Package },
  { label: "Cargo", to: "/cargo", icon: Ship },
  { label: "Bus", to: "/bus", icon: Bus },
  { label: "Séjours", to: "/sejours", icon: Palmtree },
  { label: "Circuits", to: "/circuits", icon: MapIcon },
  { label: "Suivi", to: "/suivi", icon: Radar },
  { label: "Solutions pro", to: "/solutions-pro", icon: Briefcase },
  { label: "SAO Money", to: "/saomoney", icon: CircleDollarSign },
] as const;

const STATUS_LABEL: Record<string, string> = {
  recue: "Reçue",
  en_cours: "En cours d'étude",
  traitee: "Traitée",
};

function EspaceClient() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Req[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [fetching, setFetching] = useState(true);

  const load = useCallback(async (uid: string) => {
    const [r, s, w] = await Promise.all([
      supabase.from("service_requests").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("shipments").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("wallets").select("balance,currency").eq("user_id", uid).maybeSingle(),
    ]);
    setRequests((r.data ?? []) as Req[]);
    setShipments((s.data ?? []) as Shipment[]);
    setWallet((w.data as Wallet | null) ?? null);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/connexion", replace: true });
      return;
    }
    void load(user.id);
  }, [loading, user, navigate, load]);

  return (
    <PageShell
      kicker="Espace client"
      title="Mon espace SAO"
      intro="Vos demandes, vos envois et vos opérations SAO Money, réunis au même endroit."
      image={hero}
      imageAlt="Hall d'aéroport"
    >
      <Section title={user ? `Bonjour ${user.email}` : "Chargement…"}>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({ to: "/connexion", replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-sao-navy"
          >
            <LogOut className="size-4" aria-hidden="true" /> Se déconnecter
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to as "/"}
              className="sao-card flex items-center gap-3 p-4 transition-colors hover:bg-secondary"
            >
              <Icon className="size-5 shrink-0 text-sao-gold" aria-hidden="true" />
              <span className="text-sm font-semibold text-sao-navy">{label}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="ivory" title="Mes demandes">
        {fetching ? (
          <p className="text-sm text-muted-foreground">Chargement de vos demandes…</p>
        ) : requests.length === 0 ? (
          <div className="sao-card p-6">
            <p className="text-sm text-muted-foreground">
              Vous n'avez encore envoyé aucune demande. Choisissez un service ci-dessus pour démarrer.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {requests.map((r) => (
              <li key={r.id} className="sao-card flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-sao-navy">{r.service}</p>
                  <p className="text-xs text-muted-foreground">
                    Réf. {r.reference} · {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  {r.details && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {Object.entries(r.details)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k} : ${v}`)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-sao-gold/15 px-3 py-1 text-xs font-semibold text-sao-navy">
                  {STATUS_LABEL[r.status] ?? r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
        <DemoNote>
          Une demande enregistrée n'est ni une réservation confirmée ni un tarif validé : elle est
          vérifiée par un conseiller avant toute confirmation.
        </DemoNote>
      </Section>

      <Section title="Mes envois">
        {shipments.length === 0 ? (
          <div className="sao-card p-6">
            <p className="text-sm text-muted-foreground">
              Aucun envoi n'est encore rattaché à votre compte. Dès qu'un envoi est enregistré par nos
              équipes, son suivi apparaît ici et sur la page Suivi.
            </p>
            <Link to="/colis" className="mt-4 inline-flex items-center rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground">
              Préparer un envoi
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3">
            {shipments.map((s) => (
              <li key={s.id} className="sao-card flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-bold text-sao-navy">Réf. {s.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.origin ?? "—"} → {s.destination ?? "—"}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-sao-navy">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section tone="ivory" title="SAO Money">
        <div className="sao-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Solde du portefeuille</p>
          <p className="mt-2 font-display text-4xl tracking-tighter text-sao-navy">
            {wallet ? `${wallet.balance.toLocaleString("fr-FR")} ${wallet.currency}` : "—"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucun paiement en ligne n'est encore branché : le solde ne bouge qu'après une opération
            confirmée par nos équipes.
          </p>
          <Link to="/saomoney" className="mt-4 inline-flex items-center rounded-full bg-sao-gold px-5 py-3 text-sm font-semibold text-sao-navy">
            Ouvrir SAO Money
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
