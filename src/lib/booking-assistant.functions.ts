import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ text: z.string().trim().min(3).max(400), iatas: z.array(z.string()).max(40) });

/** Transforme une phrase libre en champs de réservation (destination, dates, passagers, classe). */
export const parseBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Assistant indisponible." };
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `Aujourd'hui: ${today}. Extrais une réservation en JSON {"depart":"NDJ"|"DSS","iata":code parmi [${data.iatas.join(",")}] ou "","aller":"YYYY-MM-DD" ou "","retour":"YYYY-MM-DD" ou "","passagers":nombre,"classe":"Économique"|"Premium économique"|"Affaires"|"Première"}. Valeurs par défaut: NDJ, 1, Économique.` },
          { role: "user", content: data.text },
        ],
      }),
    });
    if (res.status === 429) return { ok: false as const, error: "Trop de demandes, réessayez." };
    if (res.status === 402) return { ok: false as const, error: "Crédits IA épuisés." };
    if (!res.ok) return { ok: false as const, error: "Assistant indisponible." };
    try {
      const j = await res.json();
      const p = JSON.parse(j.choices[0].message.content);
      return { ok: true as const, fields: p as { depart?: string; iata?: string; aller?: string; retour?: string; passagers?: number; classe?: string } };
    } catch {
      return { ok: false as const, error: "Demande non comprise, reformulez." };
    }
  });
