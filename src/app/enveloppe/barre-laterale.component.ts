import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAppWindow, LucideBlocks, LucideChevronDown, LucideRocket } from '@lucide/angular';
import { parCategorie } from '../catalogue/catalogue';
import { ecransDuProduit } from '../prototypes/ecrans';
import { PRODUITS } from '../prototypes/produits';

type Section = 'composants' | 'prototypes';

/**
 * Barre latérale du hub, sur fond sombre comme le shell du SIRH (tokens du menu latéral du kit).
 * Trois niveaux : sections (repliables), catégories ou produits, puis composants ou écrans.
 */
@Component({
  selector: 'app-barre-laterale',
  imports: [RouterLink, RouterLinkActive, LucideRocket, LucideBlocks, LucideAppWindow, LucideChevronDown],
  template: `
    <a class="marque" routerLink="/demarrer">Socium Design Hub</a>
    <nav aria-label="Navigation du hub">
      <a class="n1-lien" routerLink="/demarrer" routerLinkActive="actif" ariaCurrentWhenActive="page">
        <svg lucideRocket class="icone" [strokeWidth]="1.5" aria-hidden="true"></svg>
        Démarrer
      </a>

      <div class="section">
        <div class="n1">
          <a class="n1-titre" routerLink="/composants">
            <svg lucideBlocks class="icone" [strokeWidth]="1.5" aria-hidden="true"></svg>
            Composants
          </a>
          <button
            type="button"
            class="chevron"
            [class.replie]="!ouvert().composants"
            [attr.aria-expanded]="ouvert().composants"
            aria-controls="section-composants"
            [attr.aria-label]="(ouvert().composants ? 'Replier' : 'Déplier') + ' Composants'"
            (click)="basculer('composants')"
          >
            <svg lucideChevronDown [strokeWidth]="1.5" aria-hidden="true"></svg>
          </button>
        </div>
        @if (ouvert().composants) {
          <div id="section-composants" class="contenu">
            @for (groupe of groupes; track groupe.categorie) {
              <p class="n2">{{ groupe.categorie }}</p>
              @for (fiche of groupe.fiches; track fiche.id) {
                <a class="n3" [routerLink]="['/composants', fiche.id]" routerLinkActive="actif" ariaCurrentWhenActive="page">
                  {{ fiche.titre }}
                </a>
              }
            }
          </div>
        }
      </div>

      <div class="section">
        <div class="n1">
          <a
            class="n1-titre"
            routerLink="/prototypes"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="actif"
            ariaCurrentWhenActive="page"
          >
            <svg lucideAppWindow class="icone" [strokeWidth]="1.5" aria-hidden="true"></svg>
            Prototypes
          </a>
          <button
            type="button"
            class="chevron"
            [class.replie]="!ouvert().prototypes"
            [attr.aria-expanded]="ouvert().prototypes"
            aria-controls="section-prototypes"
            [attr.aria-label]="(ouvert().prototypes ? 'Replier' : 'Déplier') + ' Prototypes'"
            (click)="basculer('prototypes')"
          >
            <svg lucideChevronDown [strokeWidth]="1.5" aria-hidden="true"></svg>
          </button>
        </div>
        @if (ouvert().prototypes) {
          <div id="section-prototypes" class="contenu">
            @for (p of produits; track p.id) {
              @if (p.ecrans.length) {
                <a
                  class="n2 n2-lien"
                  [routerLink]="['/prototypes', p.id]"
                  [routerLinkActiveOptions]="{ exact: true }"
                  routerLinkActive="actif"
                  ariaCurrentWhenActive="page"
                >
                  {{ p.nom }}
                  <span class="badge">{{ p.ecrans.length }}<span class="lecteur"> écrans</span></span>
                </a>
                @for (e of p.ecrans; track e.id) {
                  <a class="n3" [routerLink]="['/prototypes', p.id, e.id]" routerLinkActive="actif" ariaCurrentWhenActive="page">
                    {{ e.titre }}
                  </a>
                }
              } @else {
                <p class="n2 inactif">{{ p.nom }} <span class="badge">Bientôt</span></p>
              }
            }
          </div>
        }
      </div>
    </nav>
  `,
  styleUrl: './barre-laterale.component.scss',
})
export class BarreLateraleComponent {
  readonly groupes = parCategorie();
  readonly produits = PRODUITS.map((p) => ({ ...p, ecrans: ecransDuProduit(p.id) }));
  readonly ouvert = signal<Record<Section, boolean>>({ composants: true, prototypes: true });

  basculer(section: Section): void {
    this.ouvert.update((o) => ({ ...o, [section]: !o[section] }));
  }
}
