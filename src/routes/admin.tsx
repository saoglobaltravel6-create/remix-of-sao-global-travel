import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PageShell, Section } from "@/components/sao/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import heroImg from "@/assets/hero-airport.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Réservations et SAO Money | SAO Global Travel" },
      { name: "description", content: "Espace réservé à l'équipe SAO : suivi des réservations, demandes et opérations SAO Money." },
      { property: "og:title", content: "Administration SAO Global Travel" },
      { property: "og:description", content: "Suivi interne des réservations et opérations SAO Money." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const REQ_STATUS = ["recue", "en_cours", "confirmee", "annulee"];
const TX_STATUS = ["en_attente", "validee", "echouee", "annulee"];
type Hist = { status: string; at: string }[];

function AdminPage() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [reqs, setReqs] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [tab, setTab] = useState<"req" | "tx">("req");

  const load = useCallback(async () => {
    const [r, t] = await Promise.all([
      supabase.from("service_requests").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("wallet_transactions").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    setReqs(r.data ?? []);
    setTxs(t.data ?? []);
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
      if (data) load();
    });
  }, [user, load]);

  async function setReqStatus(r: any, status: string) {
    const history: Hist = [...((r.details?.history as Hist) ?? []), { status, at: new Date().toISOString() }];
    await supabase.from("service_requests").update({ status, details: { ...r.details, history } }).eq("id", r.id);
    load();
  }
  async function setTxStatus(t: any, status: string) {
    await supabase.from("wallet_transactions").update({ status }).eq("id", t.id);
    load();
  }

  const fmt = (d: string) => new Date(d).toLocaleString("fr-FR");
  const sel = "rounded-lg border border-border bg-background px-2 py-1 text-xs";

  let body;
  if (loading || (user && isAdmin === null)) body = <p className="text-sm text-muted-foreground">Chargement…</p>;
  else if (!user) body = <p className="text-sm">Réservé à l'équipe SAO. <Link to="/connexion" className="font-semibold underline">Se connecter</Link></p>;
  else if (!isAdmin) body = <p className="text-sm text-muted-foreground">Votre compte n'a pas les droits d'administration.</p>;
  else
    body = (
      <>
        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("req")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "req" ? "bg-sao-navy text-primary-foreground" : "bg-secondary text-sao-navy"}`}>Réservations & demandes ({reqs.length})</button>
          <button onClick={() => setTab("tx")} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "tx" ? "bg-sao-navy text-primary-foreground" : "bg-secondary text-sao-navy"}`}>SAO Money ({txs.length})</button>
        </div>
        <div className="space-y-3">
          {tab === "req"
            ? reqs.map((r) => (
                <article key={r.id} className="sao-card p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sao-navy">{r.reference} · {r.service}</strong>
                    <select className={sel} value={r.status} onChange={(e) => setReqStatus(r, e.target.value)} aria-label="Statut">
                      {REQ_STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Créée le {fmt(r.created_at)}</p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">{Object.entries(r.details ?? {}).filter(([k]) => k !== "history").map(([k, val]) => `${k}: ${val}`).join("\n")}</pre>
                  {(r.details?.history as Hist)?.length > 0 && (
                    <ul className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
                      {(r.details.history as Hist).map((h, i) => <li key={i}>{fmt(h.at)} → {h.status}</li>)}
                    </ul>
                  )}
                </article>
              ))
            : txs.map((t) => (
                <article key={t.id} className="sao-card flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                  <div>
                    <strong className="text-sao-navy">{t.kind} · {Number(t.amount).toLocaleString("fr-FR")} {t.currency}</strong>
                    <p className="text-xs text-muted-foreground">{t.beneficiary ?? "—"} · {fmt(t.created_at)} · mis à jour {fmt(t.updated_at)}{t.is_real ? "" : " · démonstration"}</p>
                  </div>
                  <select className={sel} value={t.status} onChange={(e) => setTxStatus(t, e.target.value)} aria-label="Statut">
                    {TX_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </article>
              ))}
        </div>
      </>
    );

  return (
    <PageShell kicker="Équipe SAO" title="Administration" intro="Réservations, demandes de service et opérations SAO Money, avec statut et historique." image={heroImg} imageAlt="">
      <Section title="Tableau de suivi">{body}</Section>
    </PageShell>
  );
}
