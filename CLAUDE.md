# Socium Design Hub

## Rôle du projet
Outil interne qui réunit la bibliothèque de composants (@socium-design/angular-components)
et les prototypes du SIRH. Il remplace Storybook. Déployé sur Vercel en attendant Azure.

## Principes UI
- Deux couches : l'enveloppe du hub (navigation, recherche, panneaux) et les aperçus de composants.
- L'enveloppe peut avoir sa propre mise en page, moderne, mais utilise uniquement
  les tokens du kit (--bridges-*) : aucune couleur, police ou espacement en dur.
- Exception : le thème de code (coloration syntaxique) a ses propres couleurs,
  définies uniquement dans src/app/code/theme-code.ts, avec un contraste ≥ 4,5:1.
- Les composants affichés viennent du kit publié, sans aucune surcharge de style.
  Les aperçus sont isolés pour que le style de l'enveloppe ne les touche jamais.
- Les contrôles du playground utilisent les composants du kit quand c'est possible.
- Chaque composant est décrit par une fiche de données (statut, variantes, réglages, API) ;
  les pages sont générées à partir de ces fiches, pas écrites à la main.
- Si un composant manque au kit, ne le recrée pas ici : signale-le-moi.

## Règles
- Ne merge, ne tague et ne publie rien sans mon accord.
- Avant chaque action irréversible, vérifie la condition et arrête-toi si elle n'est pas remplie.
- Ne commite et ne pousse (sur n'importe quelle branche) qu'après un build et des tests
  réussis, avec une commande qui s'arrête au premier échec.
- Ne jamais écrire de jeton dans un fichier du repo ou dans un message.
- Si un fichier attendu manque, demande-moi au lieu de chercher ailleurs sur ma machine.
- Ne rien modifier dans sirh_prototype ni dans design_system_angular depuis ce projet.
- Pas de vraies données clients dans les prototypes (noms, montants, entreprises fictifs).
- Le dépôt est public temporairement : rien de sensible dans le code ni dans les commits.
- Préfixe des commits : « Hub > … ».
