import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LucideExternalLink } from '@lucide/angular';
import { SocAppIconGlyph, SocTag } from '@socium-design/angular-components';
import { ecransDuProduit, STATUTS_ECRAN } from '../ecrans';
import { produit } from '../produits';

/** Page d'un produit : ses écrans prototypés, tirés des fiches. */
@Component({
  selector: 'app-produit-page',
  imports: [RouterLink, SocAppIconGlyph, SocTag, LucideExternalLink],
  template: `
    @if (fiche(); as p) {
      <p class="fil"><a routerLink="/prototypes">Prototypes</a> · {{ p.nom }}</p>
      <div class="titre">
        <span class="glyphe"><soc-app-icon-glyph [name]="p.icone" aria-hidden="true" /></span>
        <h1>{{ p.nom }}</h1>
        @if (ecrans().length) {
          <span class="compte">{{ ecrans().length }} {{ ecrans().length > 1 ? 'écrans' : 'écran' }}</span>
        } @else {
          <soc-tag color="information">Bientôt</soc-tag>
        }
      </div>
      <p class="intro">{{ p.description }}</p>

      @if (ecrans().length) {
        <div class="carte defile" tabindex="0" role="region" aria-label="Écrans prototypés">
          <table>
            <thead>
              <tr><th>Écran</th><th>Route</th><th>Statut</th><th>Épique</th></tr>
            </thead>
            <tbody>
              @for (e of ecrans(); track e.id) {
                <tr>
                  <td><a class="ecran" [routerLink]="['/prototypes', p.id, e.id]">{{ e.titre }}</a></td>
                  <td><code>{{ e.route }}</code></td>
                  <td><soc-tag [color]="statuts[e.statut].couleur">{{ statuts[e.statut].libelle }}</soc-tag></td>
                  <td>
                    @if (e.epique) {
                      <a class="externe" [href]="e.epique" target="_blank" rel="noopener noreferrer">
                        Notion <svg lucideExternalLink [strokeWidth]="1.5" aria-hidden="true"></svg>
                        <span class="lecteur">(épique de « {{ e.titre }} », nouvel onglet)</span>
                      </a>
                    } @else {
                      <span class="vide">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <p class="intro">Aucun écran prototypé pour l'instant.</p>
      }
    } @else {
      <h1>Produit introuvable</h1>
      <p class="intro">Aucun produit ne porte l'identifiant « {{ produit() }} ».</p>
    }
  `,
  styleUrls: ['./page.scss', './produit-page.component.scss'],
})
export class ProduitPageComponent {
  readonly produit = input.required<string>();
  readonly fiche = computed(() => produit(this.produit()));
  readonly ecrans = computed(() => ecransDuProduit(this.produit()));
  readonly statuts = STATUTS_ECRAN;

  constructor() {
    const titre = inject(Title);
    effect(() => titre.setTitle(`${this.fiche()?.nom ?? 'Produit introuvable'} — Prototypes — Socium Design Hub`));
  }
}
