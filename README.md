# Socium Design Hub

Outil interne qui réunit la bibliothèque de composants `@socium-design/angular-components` et les prototypes
des produits Socium (remplacera Storybook). Angular 19, composants standalone, signals.

## Sections

- `/composants` — catalogue des composants du kit (vide pour l'instant)
- `/prototypes` — prototypes des produits (vide pour l'instant)

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
