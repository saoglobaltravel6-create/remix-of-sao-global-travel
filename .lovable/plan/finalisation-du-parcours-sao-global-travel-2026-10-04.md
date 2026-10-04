# Finalisation du parcours SAO Global Travel

## Résultat visé

- Valider visuellement les logos et le flou sur mobile et ordinateur, en corrigeant le préchargeur qui masquait les captures.
- Sécuriser le parcours de réservation et son paiement par solde SAO Money, avec statuts pilotés depuis l’administration.
- Tester le parcours Voyager complet jusqu’à l’apparition de la réservation dans l’administration.
- Activer l’envoi transactionnel du formulaire Contact dès que le domaine est configuré.
- Finaliser le globe interactif, l’annuaire partenaires, les témoignages explicitement marqués comme démonstration et la page Contact.

## Travaux

1. **Contrôle visuel**
  - Neutraliser le préchargeur pendant les tests automatisés, puis capturer l’en-tête, le moteur et le footer à 390 px et 1280 px.
  - Vérifier le logo couleur en haut, le logo blanc en bas, l’absence de débordement et le flou uniquement sur les onglets mobiles.
2. **SAO Money et administration**
  - Remplacer les changements directs de statut par une opération atomique sécurisée côté base.
  - Autoriser une seule validation d’une opération en attente, débiter/créditer le portefeuille selon son type et refuser les soldes négatifs.
  - Lier clairement l’opération SAO Money à la réservation et synchroniser les statuts affichés côté client et administration.
  - Corriger l’attribution trop large du rôle administrateur et conserver uniquement le compte demandé comme administrateur.
  - Ne pas présenter ce portefeuille interne comme une passerelle bancaire externe.
3. **Parcours Voyager**
  - Utiliser un compte de test authentifié pour choisir destination, date, classe et SAO Money.
  - Confirmer la demande, vérifier la référence dans l’espace client, puis la retrouver dans l’administration.
  - Vérifier la mise à jour du statut et du solde, ainsi que les erreurs visibles.
4. **Contact et domaine**
  - Préparer l’envoi transactionnel réel vers `contact@saoglobaltravel.com` et une confirmation visible après envoi.
  - Configurer les modèles et le traitement côté serveur uniquement après association et vérification du domaine.
  - Expliquer le blocage exact : aucun domaine personnalisé ni domaine d’envoi `saoglobaltravel.com` n’est actuellement configuré dans ce projet.
5. **Sections éditoriales**
  - Transformer le globe existant en expérience interactive basée sur les destinations et coordonnées déjà présentes ; un clic préremplit le moteur.
  - Construire l’annuaire partenaires sans inventer d’accord commercial ni logo : catégories vérifiables et appel à candidature.
  - Ajouter des témoignages uniquement comme contenus de démonstration clairement étiquetés.
  - Finaliser la page Contact avec coordonnées existantes, validation, états d’envoi et mode indisponible explicite tant que le domaine bloque l’envoi.

## Contraintes externes

- Les paiements intégrés Lovable ne sont pas disponibles pour une entreprise enregistrée au Tchad et ce type de service. Une vraie collecte bancaire/mobile nécessite donc un prestataire compatible fourni par SAO ; le travail ci-dessus sécurise uniquement le portefeuille interne et son approbation administrative.
- L’envoi e-mail réel reste bloqué jusqu’à l’association de `saoglobaltravel.com` au projet et à la validation de ses enregistrements DNS.
- Oui et ajoute 
  Vérifie en-tête, footer et flou sur mobile et desktop : logo bleu/or, logo blanc, flou du moteur de recherche.
  Parcours complet de la carte Voyager : choix de destination, date, classe, paiement, confirmation, puis vérifie que la réservation apparaît dans l'admin.
  Connecte le paiement réel sur la réservation avec SAO Money, en utilisant les données de la page admin pour les statuts.
  Active l'envoi réel du formulaire Contact vers contact@saoglobaltravel.com, en m'expliquant ce qui bloque le domaine saoglobaltravel.com.
  Implémente le globe 3D, l'anuaire partenaires, les témoignages et la page Contact, en suivant les sections déjà validées de l'accueil.

## Vérifications finales

- Parcours sans erreur à 390 px et 1280 px.
- Contrôle des droits d’accès, double validation, solde insuffisant et visibilité des données par propriétaire.
- Vérification des erreurs d’exécution, de la compilation et des métadonnées des pages modifiées.