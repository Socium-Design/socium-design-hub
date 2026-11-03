import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SocAppIconGlyph, SocTag } from '@socium-design/angular-components';
import { ecransDuProduit } from '../ecrans';
import { PRODUITS } from '../produits';

/**
 * Accueil Prototypes : une carte par produit. La carte n'existe pas dans le kit (0.3.6) : c'est un élément de
 * l'enveloppe, fait avec les tokens, candidat pour le kit.
 */
@Component({
  selector: 'app-prototypes-accueil',
  imports: [NgTemplateOutlet, RouterLink, SocAppIconGlyph, SocTag],
  template: `
    <h1>Prototypes</h1>
    <p class="intro">Les écrans du SIRH, à essayer sans quitter le hub.</p>

    <ul class="cartes">
      @for (carte of cartes; track carte.id) {
        <li>
          @if (carte.ecrans) {
            <a class="carte" [routerLink]="['/prototypes', carte.id]">
              <ng-container [ngTemplateOutlet]="contenu" [ngTemplateOutletContext]="{ $implicit: carte }" />
            </a>
          } @else {
            <div class="carte bientot">
              <ng-container [ngTemplateOutlet]="contenu" [ngTemplateOutletContext]="{ $implicit: carte }" />
            </div>
          }
        </li>
      }
    </ul>

    <ng-template #contenu let-carte>
      @if (carte.illustration) {
        <img class="illustration" [src]="'illustrations/' + carte.illustration" alt="" />
      } @else {
        <div class="illustration neutre" aria-hidden="true"></div>
      }
      <div class="corps">
        <div class="nom">
          <span class="glyphe"><soc-app-icon-glyph [name]="carte.icone" aria-hidden="true" /></span>
          <h2>{{ carte.nom }}</h2>
        </div>
        <p class="description">{{ carte.description }}</p>
        @if (carte.ecrans) {
          <span class="compte">{{ carte.ecrans }} {{ carte.ecrans > 1 ? 'écrans' : 'écran' }}</span>
        } @else {
          <soc-tag color="information">Bientôt</soc-tag>
        }
      </div>
    </ng-template>
  `,
  styleUrls: ['./page.scss', './prototypes-accueil.component.scss'],
})
export class PrototypesAccueilComponent {
  readonly cartes = PRODUITS.map((p) => ({ ...p, ecrans: ecransDuProduit(p.id).length }));
}
