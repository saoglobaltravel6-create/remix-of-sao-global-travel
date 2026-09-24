import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ query: z.string().trim().min(2).max(500) });

const SYSTEM = `Tu es le conseiller voyage de SAO Global Travel (bases : N'Djamena, Tchad et Dakar, Sénégal).
Réponds en français, de façon concise (maximum 180 mots), avec des puces courtes.
Donne des conseils pratiques personnalisés : meilleure période, formalités générales à vérifier, idées d'activités, conseils bagages.
Ne donne JAMAIS de prix, d'horaires, de compagnies précises ni de disponibilités : indique que les tarifs sont « sur demande » auprès de SAO Global Travel.
Termine par une phrase invitant à contacter SAO Global Travel ou à rechercher un vol.`;

export const getTravelAdvice = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Service momentanément indisponible." };

    const { streamText } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: SYSTEM,
        prompt: data.query,
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = (await result.text).trim();
      if (!text) return { ok: false as const, error: "Aucune recommandation reçue. Reformulez votre demande." };
      return { ok: true as const, text };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return { ok: false as const, error: "Trop de demandes, réessayez dans un instant." };
      if (status === 402) return { ok: false as const, error: "Crédits IA épuisés pour le moment." };
      return { ok: false as const, error: "Le conseiller est indisponible pour le moment." };
    }
  });
