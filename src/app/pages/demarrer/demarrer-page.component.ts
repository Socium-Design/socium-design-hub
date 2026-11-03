import { Component } from '@angular/core';
import { KIT_PAQUET, KIT_VERSION } from '../../catalogue/api-kit';

@Component({
  selector: 'app-demarrer-page',
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
        <pre><code>{{ '@socium-design:registry=https://npm.pkg.github.com' }}</code></pre>
      </li>
      <li>
        <h2>S'authentifier</h2>
        <p>
          Le jeton personnel (scope <code>read:packages</code>) se met dans <code>~/.npmrc</code>, jamais dans un dépôt :
        </p>
        <pre><code>{{ '//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}' }}</code></pre>
      </li>
      <li>
        <h2>Installer</h2>
        <pre><code>npm install {{ paquet }} &#64;lucide/angular</code></pre>
      </li>
      <li>
        <h2>Charger la feuille du kit</h2>
        <p>Une seule fois, dans <code>angular.json</code> (build et test). Elle contient les tokens, les polices et les styles des composants :</p>
        <pre><code>{{ styles }}</code></pre>
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
  readonly styles = `"styles": ["node_modules/${KIT_PAQUET}/styles.css", "src/styles.scss"]`;
}
