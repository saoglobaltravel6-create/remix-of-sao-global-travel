import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { getTravelAdvice } from "@/lib/travel-advisor.functions";

const IDEAS = ["Que faire à Dubaï en 5 jours ?", "Préparer un voyage N'Djamena → Paris", "Meilleure période pour Istanbul ?"];

export function TravelAdvisor() {
  const ask = useServerFn(getTravelAdvice);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(q: string) {
    const v = q.trim();
    if (v.length < 2 || loading) return;
    setLoading(true); setError(null); setAnswer(null);
    try {
      const r = await ask({ data: { query: v } });
      if (r.ok) setAnswer(r.text); else setError(r.error);
    } catch {
      setError("Le conseiller est indisponible pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="sao-container py-20" aria-labelledby="advisor-title">
      <div className="sao-card p-6 md:p-10">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sao-gold">
          <Sparkles className="size-4" aria-hidden="true" /> Conseiller voyage IA
        </span>
        <h2 id="advisor-title" className="mt-3 font-display text-3xl text-sao-navy md:text-4xl">
          Une destination, une question ? Recevez des conseils personnalisés.
        </h2>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => { e.preventDefault(); submit(query); }}
        >
          <label htmlFor="advisor-q" className="sr-only">Votre destination ou question</label>
          <input
            id="advisor-q"
            value={query}
            maxLength={500}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex. : un séjour en famille à Casablanca en décembre"
            className="h-12 flex-1 rounded-full border border-input bg-secondary/60 px-5 text-base text-sao-navy outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sao-gold px-6 text-sm font-semibold text-sao-navy disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
            {loading ? "Réflexion…" : "Obtenir des conseils"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {IDEAS.map((i) => (
            <button key={i} type="button" onClick={() => { setQuery(i); submit(i); }}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-sao-gold hover:text-sao-navy">
              {i}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="mt-6">
          {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
          {answer && (
            <div className="rounded-2xl border border-border bg-sao-ivory/60 p-5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-sao-navy">{answer.replace(/\*\*/g, "")}</p>
              <p className="mt-4 text-xs text-muted-foreground">Conseils générés par IA, à titre indicatif. Tarifs et disponibilités sur demande.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
