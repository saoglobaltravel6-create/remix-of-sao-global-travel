CREATE TABLE public.observed_flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icao24 text NOT NULL,
  callsign text,
  origin_country text,
  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  last_latitude double precision,
  last_longitude double precision,
  last_baro_altitude double precision,
  last_velocity double precision,
  last_track double precision,
  on_ground boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'opensky',
  origin_airport text,
  destination_airport text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.observed_flights TO anon, authenticated;
GRANT ALL ON public.observed_flights TO service_role;
ALTER TABLE public.observed_flights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read observed flights" ON public.observed_flights FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX observed_flights_icao24_idx ON public.observed_flights (icao24, last_seen_at DESC);
CREATE INDEX observed_flights_first_seen_idx ON public.observed_flights (first_seen_at);
CREATE INDEX observed_flights_last_seen_idx ON public.observed_flights (last_seen_at);
CREATE TRIGGER observed_flights_updated_at BEFORE UPDATE ON public.observed_flights FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- A session continues while the same aircraft is seen again within 30 minutes; otherwise a new session row is created.
CREATE OR REPLACE FUNCTION public.record_observed_flights(_states jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  WITH s AS (
    SELECT DISTINCT ON (x.icao24) x.* FROM jsonb_to_recordset(_states) AS x(
      icao24 text, callsign text, origin_country text, lat double precision, lon double precision,
      alt double precision, vel double precision, trk double precision, on_ground boolean, seen timestamptz)
    WHERE x.icao24 IS NOT NULL AND x.seen IS NOT NULL
    ORDER BY x.icao24, x.seen DESC
  ), upd AS (
    UPDATE public.observed_flights f SET
      callsign = COALESCE(NULLIF(s.callsign, ''), f.callsign),
      last_seen_at = GREATEST(f.last_seen_at, s.seen),
      last_latitude = s.lat, last_longitude = s.lon, last_baro_altitude = s.alt,
      last_velocity = s.vel, last_track = s.trk, on_ground = COALESCE(s.on_ground, false)
    FROM s
    WHERE f.icao24 = s.icao24 AND f.last_seen_at >= s.seen - interval '30 minutes'
    RETURNING f.icao24
  )
  INSERT INTO public.observed_flights (icao24, callsign, origin_country, first_seen_at, last_seen_at,
    last_latitude, last_longitude, last_baro_altitude, last_velocity, last_track, on_ground)
  SELECT s.icao24, NULLIF(s.callsign, ''), s.origin_country, s.seen, s.seen, s.lat, s.lon, s.alt, s.vel, s.trk, COALESCE(s.on_ground, false)
  FROM s WHERE s.icao24 NOT IN (SELECT icao24 FROM upd);
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;
REVOKE ALL ON FUNCTION public.record_observed_flights(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_observed_flights(jsonb) TO service_role;