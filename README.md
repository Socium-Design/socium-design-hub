# Socium Design Hub

Outil interne qui réunit la bibliothèque de composants `@socium-design/angular-components` et les prototypes
des produits Socium (remplacera Storybook). Angular 19, composants standalone, signals.

## Sections

- `/demarrer` — installer et utiliser le kit
- `/composants/<id>` — une page par composant, générée depuis sa fiche (`src/app/catalogue/fiches/`)
- `/prototypes` — prototypes des produits (vide pour l'instant)

## Fiches et API

- Une fiche (`<id>.fiche.ts`) décrit le composant : catégorie, statut, description, réglages du playground, variantes,
  états. Elle s'ajoute dans `src/app/catalogue/catalogue.ts`, avec son gabarit d'aperçu (`<id>.apercu.ts`).
- L'API (sélecteur, inputs, slots, types, version, lien source) vient du kit installé : `scripts/extraire-api-kit.mjs`
  copie `docs/generated/components.json` du paquet vers `src/app/generated/` avant `start`, `build` et `test`.
- Les aperçus sont rendus dans des iframes (`/apercu/<id>`) : seule la feuille du kit s'y applique.

## Installation

Le kit est un paquet privé publié sur GitHub Packages. Le `.npmrc` du dépôt ne contient que le registre ;
le jeton personnel (scope `read:packages`) se met dans `~/.npmrc`, jamais dans ce dépôt :

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install
npm start          # http://localhost:4200
npm run build
npm run test:ci    # Chrome headless (définir CHROME_BIN si Chrome n'est pas dans /Applications)
```

## Règles

Uniquement les composants et les tokens du kit (`var(--bridges-*)`), jamais de valeurs en dur.
