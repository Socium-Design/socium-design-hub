import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { parCategorie } from '../catalogue/catalogue';
import { ecransDuProduit } from '../prototypes/ecrans';
import { PRODUITS } from '../prototypes/produits';

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

      <p class="rubrique">
        <a routerLink="/prototypes" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="actif-rubrique">Prototypes</a>
      </p>
      @for (p of produits; track p.id) {
        @if (p.ecrans.length) {
          <a
            class="lien sous"
            [routerLink]="['/prototypes', p.id]"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="actif"
            ariaCurrentWhenActive="page"
          >
            {{ p.nom }} <span class="compte">{{ p.ecrans.length }}</span>
          </a>
          @if (produitOuvert() === p.id) {
            @for (e of p.ecrans; track e.id) {
              <a class="lien ecran" [routerLink]="['/prototypes', p.id, e.id]" routerLinkActive="actif" ariaCurrentWhenActive="page">
                {{ e.titre }}
              </a>
            }
          }
        } @else {
          <span class="lien sous inactif">{{ p.nom }} <span class="compte">Bientôt</span></span>
        }
      }
    </nav>
  `,
  styleUrl: './barre-laterale.component.scss',
})
export class BarreLateraleComponent {
  readonly groupes = parCategorie();
  readonly produits = PRODUITS.map((p) => ({ ...p, ecrans: ecransDuProduit(p.id) }));

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  /** Produit dont la page (ou un écran) est ouverte : ses écrans s'affichent sous lui. */
  readonly produitOuvert = computed(() => /^\/prototypes\/([^/?#]+)/.exec(this.url())?.[1] ?? null);
}
