import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Tx = {
  id: string;
  kind: string;
  amount: number;
  currency: string;
  beneficiary: string | null;
  status: string;
  created_at: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  en_attente: { label: "En attente", cls: "bg-sao-gold/15 text-sao-navy" },
  validee: { label: "Validée", cls: "bg-emerald-500/15 text-emerald-700" },
  reussie: { label: "Réussie", cls: "bg-emerald-500/15 text-emerald-700" },
  echouee: { label: "Échouée", cls: "bg-destructive/10 text-destructive" },
};

/** Portefeuille SAO Money : solde, opérations et historique. Aucun paiement réel n'est simulé. */
export function WalletPanel() {
  const { user, loading } = useAuth();
  const [balance, setBalance] = useState<{ balance: number; currency: string } | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [kind, setKind] = useState<"depot" | "transfert">("transfert");
  const [amount, setAmount] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (uid: string) => {
    const [w, t] = await Promise.all([
      supabase.from("wallets").select("balance,currency").eq("user_id", uid).maybeSingle(),
      supabase.from("wallet_transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);
    setBalance((w.data as { balance: number; currency: string } | null) ?? { balance: 0, currency: "XAF" });
    setTxs((t.data ?? []) as Tx[]);
  }, []);

  useEffect(() => {
    if (user) void load(user.id);
  }, [user, load]);

  if (loading) return <div className="sao-card p-6 text-sm text-muted-foreground">Chargement…</div>;

  if (!user) {
    return (
      <div className="sao-card p-6">
        <h3 className="font-bold text-sao-navy">Votre portefeuille SAO Money</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous pour voir votre solde, enregistrer une opération et consulter votre historique.
        </p>
        <Link to="/connexion" className="mt-4 inline-flex items-center gap-2 rounded-full bg-sao-navy px-5 py-3 text-sm font-semibold text-primary-foreground">
          <LogIn className="size-4" aria-hidden="true" /> Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="sao-card p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Solde disponible</p>
        <p className="mt-2 font-display text-5xl tracking-tighter text-sao-navy">
          {balance ? balance.balance.toLocaleString("fr-FR") : "—"}
          <span className="ml-2 text-lg text-muted-foreground">{balance?.currency ?? ""}</span>
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-sao-gold/40 bg-sao-gold/10 p-4 text-sm text-sao-navy">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sao-gold" aria-hidden="true" />
          <span>
            Le portefeuille interne est actif : une opération reste « en attente » jusqu'à sa validation
            par l'équipe SAO. Aucun prestataire bancaire ou mobile money externe n'est connecté.
          </span>
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            const { error: err } = await supabase.from("wallet_transactions").insert({
              user_id: user.id,
              kind,
              amount: Number(amount),
              beneficiary: beneficiary || null,
              status: "en_attente",
            });
            if (err) setError(err.message);
            else {
              setAmount("");
              setBeneficiary("");
              await load(user.id);
            }
            setBusy(false);
          }}
        >
          <div className="flex gap-1 rounded-full bg-secondary p-1">
            {(["transfert", "depot"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`h-10 flex-1 rounded-full text-sm font-semibold ${kind === k ? "bg-sao-navy text-primary-foreground" : "text-sao-navy"}`}
              >
                {k === "transfert" ? "Transfert" : "Dépôt"}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Montant</span>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-sao-navy"
            />
          </label>
          {kind === "transfert" && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Bénéficiaire</span>
              <input
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="Nom et téléphone du bénéficiaire"
                className="h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-sao-navy"
              />
            </label>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-sao-navy px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            Enregistrer l'opération
          </button>
        </form>
      </div>

      <div className="sao-card p-6">
        <h3 className="font-bold text-sao-navy">Historique des opérations</h3>
        {txs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Aucune opération enregistrée pour le moment.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {txs.map((t) => {
              const s = STATUS[t.status] ?? { label: t.status, cls: "bg-secondary text-sao-navy" };
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-sao-navy">
                      {t.kind === "depot" ? "Dépôt" : "Transfert"}
                      {t.beneficiary ? ` — ${t.beneficiary}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sao-navy">
                      {t.amount.toLocaleString("fr-FR")} {t.currency}
                    </p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>
                      {s.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
