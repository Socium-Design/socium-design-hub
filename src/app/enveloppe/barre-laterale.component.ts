import { Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { LucideAppWindow, LucideBlocks, LucideChevronDown, LucideRocket } from '@lucide/angular';
import { parCategorie } from '../catalogue/catalogue';
import { ecransDuProduit } from '../prototypes/ecrans';
import { PRODUITS } from '../prototypes/produits';

type Section = 'composants' | 'prototypes';

/**
 * Barre latérale du hub, sur fond sombre comme le shell du SIRH (tokens du menu latéral du kit).
 * Trois niveaux : sections (repliables), catégories ou produits, puis composants ou écrans.
 * Par défaut, seuls la section et le produit de la page en cours sont dépliés ; le chevron déplie les autres.
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
                <div class="n2 n2-ligne">
                  <a
                    class="n2-lien"
                    [routerLink]="['/prototypes', p.id]"
                    [routerLinkActiveOptions]="{ exact: true }"
                    routerLinkActive="actif"
                    ariaCurrentWhenActive="page"
                  >
                    {{ p.nom }}
                    <span class="badge">{{ p.ecrans.length }}<span class="lecteur"> écrans</span></span>
                  </a>
                  <button
                    type="button"
                    class="chevron petit"
                    [class.replie]="!produitsOuverts().has(p.id)"
                    [attr.aria-expanded]="produitsOuverts().has(p.id)"
                    [attr.aria-controls]="'produit-' + p.id"
                    [attr.aria-label]="(produitsOuverts().has(p.id) ? 'Replier' : 'Déplier') + ' ' + p.nom"
                    (click)="basculerProduit(p.id)"
                  >
                    <svg lucideChevronDown [strokeWidth]="1.5" aria-hidden="true"></svg>
                  </button>
                </div>
                @if (produitsOuverts().has(p.id)) {
                  <div class="contenu" [id]="'produit-' + p.id">
                    @for (e of p.ecrans; track e.id) {
                      <a class="n3" [routerLink]="['/prototypes', p.id, e.id]" routerLinkActive="actif" ariaCurrentWhenActive="page">
                        {{ e.titre }}
                      </a>
                    }
                  </div>
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

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  /** Section et produit de la page en cours, tirés de l'URL. */
  private readonly sectionCourante = computed<Section | null>(() => {
    const premier = this.url().split(/[/?#]/)[1];
    return premier === 'composants' || premier === 'prototypes' ? premier : null;
  });
  private readonly produitCourant = computed(() => /^\/prototypes\/([^/?#]+)/.exec(this.url())?.[1] ?? null);

  // Repartent de l'état par défaut quand on change de section ou de produit ; le chevron les modifie entre-temps.
  readonly ouvert = linkedSignal<Record<Section, boolean>>(() => ({
    composants: this.sectionCourante() === 'composants',
    prototypes: this.sectionCourante() === 'prototypes',
  }));
  readonly produitsOuverts = linkedSignal(() => new Set(this.produitCourant() ? [this.produitCourant()!] : []));

  basculer(section: Section): void {
    this.ouvert.update((o) => ({ ...o, [section]: !o[section] }));
  }

  basculerProduit(id: string): void {
    this.produitsOuverts.update((ouverts) => {
      const suivants = new Set(ouverts);
      if (!suivants.delete(id)) suivants.add(id);
      return suivants;
    });
  }
}
