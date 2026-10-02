import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ text: z.string().trim().min(3).max(400), iatas: z.array(z.string()).max(40) });
type Fields = { depart?: string; iata?: string; aller?: string; retour?: string; passagers?: number; classe?: string };

/** Transforme une phrase libre en champs de réservation (destination, dates, passagers, classe). */
export const parseBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Assistant indisponible." };
    const { generateText } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const today = new Date().toISOString().slice(0, 10);
    try {
      const r = await generateText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: `Aujourd'hui: ${today}. Réponds UNIQUEMENT par un objet JSON {"depart":"NDJ"|"DSS","iata":code parmi [${data.iatas.join(",")}] ou "","aller":"YYYY-MM-DD" ou "","retour":"YYYY-MM-DD" ou "","passagers":nombre,"classe":"Économique"|"Premium économique"|"Affaires"|"Première"}. Défauts: NDJ, 1, Économique.`,
        prompt: data.text,
        maxRetries: 0,
        providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] } },
      });
      const m = r.text.match(/\{[\s\S]*\}/);
      if (!m) return { ok: false as const, error: "Demande non comprise, reformulez." };
      return { ok: true as const, fields: JSON.parse(m[0]) as Fields };
    } catch (e: unknown) {
      const s = (e as { statusCode?: number })?.statusCode;
      if (s === 429) return { ok: false as const, error: "Trop de demandes, réessayez." };
      if (s === 402) return { ok: false as const, error: "Crédits IA épuisés." };
      return { ok: false as const, error: "Assistant indisponible." };
    }
  });
