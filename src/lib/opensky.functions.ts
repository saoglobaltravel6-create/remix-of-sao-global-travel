import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Compact aircraft tuple: [icao24, callsign, country, lastContact, lon, lat, baroAlt, onGround, velocity, track, verticalRate] */
export type AircraftTuple = [string, string, string, number, number | null, number | null, number | null, boolean, number | null, number | null, number | null];

export type RadarStatus = "ok" | "rate_limited" | "unauthorized" | "unavailable" | "invalid" | "network";

export type RadarResponse = {
  status: RadarStatus;
  message: string | null;
  aircraft: AircraftTuple[];
  dataTime: number | null; // OpenSky "time" (unix s)
  fetchedAt: number | null; // when the server got this data (ms)
  latencyMs: number | null;
  cached: boolean;
  retryAfterSec: number | null;
  authenticated: boolean;
  persisted: "ok" | "skipped" | "error";
};

const API = "https://opensky-network.org/api";
const STATES_TTL_MS = 60_000; // anonymous: ~400 credits/day, global /states/all = 4 credits

// Per-worker cache shared by every visitor hitting this isolate.
const cache: { last: RadarResponse | null; blockedUntil: number; inflight: Promise<RadarResponse> | null } = {
  last: null,
  blockedUntil: 0,
  inflight: null,
};
let token: { value: string; exp: number } | null = null;

async function authHeader(): Promise<Record<string, string>> {
  const id = process.env["OPENSKY_CLIENT_ID"];
  const secret = process.env["OPENSKY_CLIENT_SECRET"];
  if (!id || !secret) return {};
  if (token && token.exp > Date.now() + 30_000) return { Authorization: `Bearer ${token.value}` };
  const res = await fetch("https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
  });
  if (!res.ok) return {};
  const j = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return { Authorization: `Bearer ${token.value}` };
}

function fromCache(status: RadarStatus, message: string, retryAfterSec: number | null): RadarResponse {
  return {
    ...(cache.last ?? { aircraft: [], dataTime: null, fetchedAt: null, latencyMs: null, authenticated: false, persisted: "skipped" as const }),
    status, message, retryAfterSec, cached: !!cache.last, persisted: "skipped",
  };
}

async function fetchStates(): Promise<RadarResponse> {
  const headers = await authHeader();
  const t0 = Date.now();
  let res: Response;
  try {
    res = await fetch(`${API}/states/all`, { headers, signal: AbortSignal.timeout(20_000) });
  } catch (e) {
    return fromCache("network", `OpenSky injoignable (${e instanceof Error ? e.name : "réseau"})`, null);
  }
  const latencyMs = Date.now() - t0;
  if (res.status === 429) {
    const ra = Number(res.headers.get("x-rate-limit-retry-after-seconds") ?? res.headers.get("retry-after") ?? 300);
    cache.blockedUntil = Date.now() + ra * 1000;
    return fromCache("rate_limited", "Limite de requêtes OpenSky atteinte (429).", ra);
  }
  if (res.status === 401 || res.status === 403) return fromCache("unauthorized", `OpenSky a refusé l'accès (${res.status}).`, null);
  if (!res.ok) return fromCache("unavailable", `Service OpenSky indisponible (${res.status}).`, null);
  let body: { time?: number; states?: unknown[][] | null };
  try { body = await res.json(); } catch { return fromCache("invalid", "Réponse OpenSky illisible.", null); }
  if (typeof body?.time !== "number") return fromCache("invalid", "Réponse OpenSky invalide.", null);

  const aircraft: AircraftTuple[] = (body.states ?? []).filter((s) => Array.isArray(s) && typeof s[0] === "string").map((s) => [
    s[0] as string, String(s[1] ?? "").trim(), String(s[2] ?? ""), Number(s[4] ?? 0),
    s[5] as number | null, s[6] as number | null, s[7] as number | null, !!s[8],
    s[9] as number | null, s[10] as number | null, s[11] as number | null,
  ]);

  let persisted: RadarResponse["persisted"] = "skipped";
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = aircraft.filter((a) => a[5] != null && a[4] != null && a[3] > 0).map((a) => ({
      icao24: a[0], callsign: a[1], origin_country: a[2], lat: a[5], lon: a[4], alt: a[6],
      vel: a[8], trk: a[9], on_ground: a[7], seen: new Date(a[3] * 1000).toISOString(),
    }));
    for (let i = 0; i < rows.length; i += 3000) {
      const { error } = await supabaseAdmin.rpc("record_observed_flights", { _states: rows.slice(i, i + 3000) });
      if (error) throw error;
    }
    persisted = "ok";
  } catch (e) {
    console.error("[radar] persist failed", e);
    persisted = "error";
  }

  return {
    status: "ok", message: null, aircraft, dataTime: body.time, fetchedAt: Date.now(), latencyMs,
    cached: false, retryAfterSec: null, authenticated: !!headers.Authorization, persisted,
  };
}

export const getRadarStates = createServerFn({ method: "GET" }).handler(async (): Promise<RadarResponse> => {
  const now = Date.now();
  if (now < cache.blockedUntil) {
    return fromCache("rate_limited", "Limite OpenSky atteinte, nouvelle tentative plus tard.", Math.ceil((cache.blockedUntil - now) / 1000));
  }
  if (cache.last && cache.last.fetchedAt && now - cache.last.fetchedAt < STATES_TTL_MS) {
    return { ...cache.last, cached: true, persisted: "skipped" };
  }
  if (!cache.inflight) {
    cache.inflight = fetchStates().then((r) => {
      if (r.status === "ok") cache.last = r;
      return r;
    }).finally(() => { cache.inflight = null; });
  }
  return cache.inflight;
});

export type FlightDetails = { status: RadarStatus; message: string | null; origin: string | null; destination: string | null; firstSeen: number | null; lastSeen: number | null };
const detailCache = new Map<string, { at: number; v: FlightDetails }>();

export const getFlightDetails = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ icao24: z.string().regex(/^[0-9a-f]{6}$/i) }).parse(d))
  .handler(async ({ data }): Promise<FlightDetails> => {
    const key = data.icao24.toLowerCase();
    const hit = detailCache.get(key);
    if (hit && Date.now() - hit.at < 10 * 60_000) return hit.v;
    const end = Math.floor(Date.now() / 1000);
    const begin = end - 2 * 86400;
    const none = (status: RadarStatus, message: string): FlightDetails => ({ status, message, origin: null, destination: null, firstSeen: null, lastSeen: null });
    let v: FlightDetails;
    try {
      const res = await fetch(`${API}/flights/aircraft?icao24=${key}&begin=${begin}&end=${end}`, { headers: await authHeader(), signal: AbortSignal.timeout(15_000) });
      if (res.status === 404) v = none("ok", "Aucun vol récent enregistré par OpenSky pour cet appareil.");
      else if (res.status === 429) v = none("rate_limited", "Limite OpenSky atteinte (429).");
      else if (res.status === 401 || res.status === 403) v = none("unauthorized", "Cet endpoint OpenSky exige un compte (identifiants non configurés).");
      else if (!res.ok) v = none("unavailable", `OpenSky indisponible (${res.status}).`);
      else {
        const list = (await res.json()) as { estDepartureAirport: string | null; estArrivalAirport: string | null; firstSeen: number; lastSeen: number }[];
        const last = Array.isArray(list) ? list.sort((a, b) => b.lastSeen - a.lastSeen)[0] : undefined;
        v = last
          ? { status: "ok", message: null, origin: last.estDepartureAirport, destination: last.estArrivalAirport, firstSeen: last.firstSeen, lastSeen: last.lastSeen }
          : none("ok", "Aucun vol récent enregistré par OpenSky pour cet appareil.");
        if (last && (last.estDepartureAirport || last.estArrivalAirport)) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("observed_flights")
              .update({ origin_airport: last.estDepartureAirport, destination_airport: last.estArrivalAirport })
              .eq("icao24", key).gte("last_seen_at", new Date((last.firstSeen - 1800) * 1000).toISOString());
          } catch (e) { console.error("[radar] details persist failed", e); }
        }
      }
    } catch {
      v = none("network", "OpenSky injoignable.");
    }
    detailCache.set(key, { at: Date.now(), v });
    return v;
  });
