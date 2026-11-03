import { Component } from '@angular/core';
import { KIT_PAQUET, KIT_VERSION } from '../../catalogue/api-kit';
import { BlocCodeComponent } from '../../code/bloc-code.component';

@Component({
  selector: 'app-demarrer-page',
  imports: [BlocCodeComponent],
  template: `
    <h1>Démarrer</h1>
    <p class="intro">
      Le hub réunit la bibliothèque <code>{{ paquet }}</code> (v{{ version }}) et les prototypes du SIRH. Pour utiliser le
      kit dans une application Angular 19 :
    </p>

    <ol>
      <li>
        <h2>Déclarer le registre</h2>
        <p>Le kit est un paquet privé publié sur GitHub Packages. Dans le <code>.npmrc</code> du projet :</p>
        <app-bloc-code [code]="registre" langage="ini" fichier=".npmrc" />
      </li>
      <li>
        <h2>S'authentifier</h2>
        <p>
          Le jeton personnel (scope <code>read:packages</code>) se met dans <code>~/.npmrc</code>, jamais dans un dépôt :
        </p>
        <app-bloc-code [code]="authentification" langage="ini" fichier="~/.npmrc" />
      </li>
      <li>
        <h2>Installer</h2>
        <app-bloc-code [code]="installation" langage="shellscript" fichier="Terminal" />
      </li>
      <li>
        <h2>Charger la feuille du kit</h2>
        <p>Une seule fois, dans <code>angular.json</code> (build et test). Elle contient les tokens, les polices et les styles des composants :</p>
        <app-bloc-code [code]="styles" langage="json" fichier="angular.json" />
      </li>
      <li>
        <h2>Utiliser un composant</h2>
        <p>Les composants sont standalone : on les ajoute aux <code>imports</code> du composant qui les utilise. Chaque page de la section Composants donne le code complet.</p>
      </li>
    </ol>
  `,
  styleUrl: './demarrer-page.component.scss',
})
export class DemarrerPageComponent {
  readonly paquet = KIT_PAQUET;
  readonly version = KIT_VERSION;
  readonly registre = '@socium-design:registry=https://npm.pkg.github.com';
  // Variable d'environnement, jamais un vrai jeton.
  readonly authentification = '//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}';
  readonly installation = `npm install ${KIT_PAQUET} @lucide/angular`;
  readonly styles = `"styles": ["node_modules/${KIT_PAQUET}/styles.css", "src/styles.scss"]`;
}
