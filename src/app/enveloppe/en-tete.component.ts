import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideMenu, LucideX } from '@lucide/angular';
import { SocButton, SocButtonLeftIcon, SocSearchBar, SocTag } from '@socium-design/angular-components';
import { composantApi, KIT_VERSION } from '../catalogue/api-kit';
import { CATALOGUE } from '../catalogue/catalogue';
import { FicheComposant } from '../catalogue/fiche.model';
import { rechercher } from './recherche';

@Component({
  selector: 'app-en-tete',
  imports: [SocSearchBar, SocTag, SocButton, SocButtonLeftIcon, LucideMenu, LucideX, RouterLink],
  host: { '(document:click)': 'fermerSiDehors($event)' },
  template: `
    <button
      socButton
      type="button"
      variant="ghost"
      class="menu"
      aria-controls="barre-laterale"
      [attr.aria-expanded]="menuOuvert()"
      (click)="basculerMenu.emit()"
    >
      @if (menuOuvert()) {
        <svg lucideX socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
      } @else {
        <svg lucideMenu socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
      }
      Menu
    </button>
    <div class="recherche" (keydown.enter)="ouvrirPremier()" (keydown.escape)="vider()">
      <soc-search-bar
        placeholder="Rechercher un composant ou un sélecteur…"
        [value]="requete()"
        (valueChange)="requete.set($event); ouvert.set(true)"
        (clear)="vider()"
      />
      @if (ouvert() && requete().trim()) {
        <ul class="resultats" aria-label="Résultats de recherche">
          @for (fiche of resultats(); track fiche.id) {
            <li>
              <a [routerLink]="['/composants', fiche.id]" (click)="vider()">
                <span>{{ fiche.titre }}</span>
                <code>{{ selecteur(fiche) }}</code>
              </a>
            </li>
          } @empty {
            <li class="vide">Aucun composant ne correspond à « {{ requete().trim() }} ».</li>
          }
        </ul>
      }
    </div>
    <div class="version">
      <span>Kit</span>
      <soc-tag color="information">v{{ version }}</soc-tag>
    </div>
  `,
  styleUrl: './en-tete.component.scss',
})
export class EnTeteComponent {
  private readonly router = inject(Router);
  private readonly hote = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly menuOuvert = input(false);
  readonly basculerMenu = output<void>();

  readonly version = KIT_VERSION;
  readonly requete = signal('');
  readonly ouvert = signal(false);
  readonly resultats = computed(() => rechercher(CATALOGUE.map((e) => e.fiche), this.requete()));

  selecteur(fiche: FicheComposant): string {
    return composantApi(fiche.composant)?.selector ?? '';
  }

  ouvrirPremier(): void {
    const premier = this.resultats()[0];
    if (premier) {
      this.router.navigate(['/composants', premier.id]);
      this.vider();
    }
  }

  vider(): void {
    this.requete.set('');
    this.ouvert.set(false);
  }

  fermerSiDehors(event: Event): void {
    if (!this.hote.nativeElement.contains(event.target as Node)) this.ouvert.set(false);
  }
}
