import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { parCategorie } from '../catalogue/catalogue';

@Component({
  selector: 'app-barre-laterale',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a class="marque" routerLink="/demarrer">Socium Design Hub</a>
    <nav aria-label="Navigation du hub">
      <a class="lien" routerLink="/demarrer" routerLinkActive="actif" ariaCurrentWhenActive="page">Démarrer</a>

      <p class="rubrique">Composants</p>
      @for (groupe of groupes; track groupe.categorie) {
        <p class="categorie">{{ groupe.categorie }}</p>
        @for (fiche of groupe.fiches; track fiche.id) {
          <a class="lien sous" [routerLink]="['/composants', fiche.id]" routerLinkActive="actif" ariaCurrentWhenActive="page">
            {{ fiche.titre }}
          </a>
        }
      }

      <p class="rubrique">Prototypes</p>
      <a class="lien" routerLink="/prototypes" routerLinkActive="actif" ariaCurrentWhenActive="page">Tous les prototypes</a>
    </nav>
  `,
  styleUrl: './barre-laterale.component.scss',
})
export class BarreLateraleComponent {
  readonly groupes = parCategorie();
}
