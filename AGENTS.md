<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
 
- The Suivi radar is a Leaflet map fed only by server functions in src/lib/opensky.functions.ts (shared cache, 429 backoff, optional OPENSKY_CLIENT_ID/SECRET); never iframe or mock aircraft, because status must reflect the last real request.
- Observed aircraft are persisted via the service-role-only record_observed_flights RPC (30-min session window per icao24), so history only covers what SAO actually saw.
