CREATE TABLE public.radar_requests (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  requested_at timestamptz NOT NULL DEFAULT now(),
  region text NOT NULL,
  status text NOT NULL,
  latency_ms integer,
  aircraft_count integer NOT NULL DEFAULT 0,
  authenticated boolean NOT NULL DEFAULT false
);
GRANT ALL ON public.radar_requests TO service_role;
ALTER TABLE public.radar_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX radar_requests_at_idx ON public.radar_requests (requested_at);

CREATE OR REPLACE FUNCTION public.radar_monthly_stats()
RETURNS TABLE(month text, requests bigint, successes bigint, rate_limited bigint, errors bigint, success_rate numeric, avg_interval_sec numeric, avg_latency_ms numeric, distinct_aircraft bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH r AS (
    SELECT to_char(date_trunc('month', requested_at), 'YYYY-MM') AS m, status, latency_ms FROM radar_requests
  ), ok AS (
    SELECT to_char(date_trunc('month', requested_at), 'YYYY-MM') AS m,
      extract(epoch FROM (max(requested_at) - min(requested_at))) / NULLIF(count(*) - 1, 0) AS avg_gap
    FROM radar_requests WHERE status = 'ok' GROUP BY 1
  ), ac AS (
    SELECT to_char(date_trunc('month', first_seen_at), 'YYYY-MM') AS m, count(DISTINCT icao24) AS n
    FROM observed_flights GROUP BY 1
  )
  SELECT r.m, count(*), count(*) FILTER (WHERE r.status='ok'), count(*) FILTER (WHERE r.status='rate_limited'),
    count(*) FILTER (WHERE r.status NOT IN ('ok','rate_limited')),
    round(100.0 * count(*) FILTER (WHERE r.status='ok') / count(*), 1),
    round(max(ok.avg_gap)::numeric, 0), round(avg(r.latency_ms)::numeric, 0), coalesce(max(ac.n), 0)
  FROM r LEFT JOIN ok ON ok.m = r.m LEFT JOIN ac ON ac.m = r.m
  GROUP BY r.m ORDER BY r.m DESC;
$$;
REVOKE ALL ON FUNCTION public.radar_monthly_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.radar_monthly_stats() TO anon, authenticated, service_role;