# Radar SAO : page dédiée, statistiques, mode authentifié, optimisation

## 1. Corriger la compilation
- Relire le journal de compilation et `opensky.functions.ts` (vers la ligne 102), corriger l'erreur de type.

## 2. Page Radar dédiée (`/radar`)
- Nouvelle page plein écran avec sa propre barre d'onglets : **Carte en direct · Statistiques · Vols observés**.
- Le radar quitte Suivi : Suivi garde le suivi colis/fret et affiche un simple lien « Ouvrir le radar ».
- « Vols historiques » devient l'onglet « Vols observés » (même page, URL conservée), menu principal : une entrée « Radar ».

## 3. Page Statistiques (`/radar/statistiques`)
Par mois, uniquement à partir de ce que SAO a réellement enregistré :
- nombre total d'avions distincts reçus ;
- nombre de requêtes et fréquence moyenne entre deux requêtes réussies ;
- taux de succès OpenSky (réussies / limitées / erreurs).
Aucune valeur n'est inventée : un mois sans requête affiche « Aucune donnée ».

## 4. Mode authentifié OpenSky
- Formulaire sécurisé pour saisir `OPENSKY_CLIENT_ID` et `OPENSKY_CLIENT_SECRET` (créés sur opensky-network.org → Compte → API client). Le code les lit déjà ; l'état technique affichera « Authentifié ».
- Sans identifiants, le radar reste en mode anonyme.

## 5. Optimisation des requêtes
- Découpage du monde en régions fixes (Afrique, Europe, Moyen-Orient, Asie, Amériques, Océanie) interrogées par zone (`lamin/lamax/lomin/lomax`), cache serveur par région (60 s anonyme, 30 s authentifié).
- La carte ne demande que les régions visibles ; vue monde = régions groupées et avions regroupés en cercles numérotés (clustering) au faible zoom.
- Limiteur côté serveur : budget de crédits quotidien, une requête en vol par région, respect du délai imposé par OpenSky (429).

## 6. Tests à l'écran (390 et 1280 px)
Actualisation, carte, plein écran, fiche avion, onglet Vols observés, Statistiques. Résultat rapporté honnêtement (OpenSky peut ne pas répondre depuis le bac à sable).

## Technique
- Table `radar_requests` (horodatage, région, statut, latence, nb avions, authentifié) écrite côté serveur par service role ; lecture publique agrégée via une fonction SQL `radar_monthly_stats()`.
- `leaflet.markercluster` pour les cercles.
- Routes : `radar.tsx` (layout + Outlet), `radar.index.tsx`, `radar.statistiques.tsx`, `radar.observes.tsx` ; `vols-historiques` redirige vers `/radar/observes`.
