# Accueil cinématique SAO Global Travel

## Objectif
Remplacer uniquement la composition de la page d’accueil par une expérience cinématique en trois séquences, tout en conservant les autres pages, leurs contenus et leur navigation.

## Déroulé par section
1. **Navigation cinématique**
   - Créer une barre fixe dédiée à l’accueil avec le logo officiel, les quatre liens numérotés, l’email et l’heure de N’Djamena.
   - Adapter automatiquement sa couleur à la séquence visible.
   - Ajouter le menu mobile plein écran, accessible et léger.

2. **Héro vidéo piloté par le défilement**
   - Réutiliser la vidéo aérienne locale et son image de repli, sans URL externe.
   - Construire une séquence de 500vh avec image fixe sur mobile et mouvement réduit.
   - Synchroniser la vidéo au défilement avec interpolation douce et afficher les trois messages à des moments distincts.
   - Conserver un seul H1 et relier les actions aux pages existantes.

3. **Transition et services en verre dépoli**
   - Ajouter l’espace narratif de 80vh.
   - Construire la scène navy, le badge, le titre et les trois capacités avec révélations décalées.
   - Réutiliser une photo SAO existante adaptée pour la carte d’assistance ; si aucune photo d’agent exploitable n’existe, utiliser le visuel de marque fourni sans le présenter comme une personne réelle.

4. **Carrousel des destinations**
   - Reprendre les photos locales disponibles et les six destinations demandées.
   - Créer la rotation centre/côtés/arrière avec transitions de position, taille et flou sur ordinateur.
   - Simplifier les effets sur mobile et relier « Découvrir » à la page Destinations.
   - Ne montrer aucun tarif, horaire ou disponibilité inventé.

5. **Bandeau et continuité du site**
   - Adapter le bandeau défilant aux trois messages demandés.
   - Conserver le footer existant et toutes les pages internes.
   - Retirer de l’accueil les anciennes sections remplacées, sans supprimer leurs composants ni leurs usages ailleurs.

## Validation
- Vérifier chaque bloc visuellement avant de poursuivre : ordinateur puis mobile.
- Contrôler les interactions, l’ouverture du menu, l’horloge, les liens, le sens aller/retour du défilement vidéo et le carrousel.
- Contrôler l’absence de débordement et d’erreurs aux largeurs 375, 430, 768 et 1280 px.
- Vérifier le mode mouvement réduit et les métadonnées de la page d’accueil.

## Détails techniques
- React 19, TanStack Router et Tailwind CSS v4 existants.
- Palette officielle via les variables sémantiques existantes, ajustées aux valeurs fournies.
- `requestAnimationFrame` uniquement pendant la séquence vidéo visible ; image de repli et fondus simples sur petit écran.
- Aucun changement de base de données ni d’intégration externe.
