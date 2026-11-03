import { Component, DestroyRef, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LucideExternalLink, LucideMaximize2, LucideMinimize2 } from '@lucide/angular';
import { SocButton, SocButtonLeftIcon, SocTag } from '@socium-design/angular-components';
import { ecran, STATUTS_ECRAN, urlPrototype } from '../ecrans';
import { produit } from '../produits';

/**
 * Page d'un écran : le prototype (sirh_prototype déployé) dans une iframe, utilisable normalement.
 * « Plein écran » est un calque de l'enveloppe : l'iframe change seulement de place à l'écran, sans être rechargée.
 */
@Component({
  selector: 'app-ecran-page',
  imports: [RouterLink, SocTag, SocButton, SocButtonLeftIcon, LucideExternalLink, LucideMaximize2, LucideMinimize2],
  host: { '(document:keydown.escape)': 'quitterPleinEcran()' },
  template: `
    @if (fiche(); as e) {
      <p class="fil">
        <a routerLink="/prototypes">Prototypes</a> · <a [routerLink]="['/prototypes', e.produit]">{{ nomProduit() }}</a> ·
        {{ e.titre }}
      </p>
      <header class="tete">
        <div class="titre">
          <h1>{{ e.titre }}</h1>
          <soc-tag [color]="statuts[e.statut].couleur">{{ statuts[e.statut].libelle }}</soc-tag>
          @if (e.epique) {
            <a class="externe" [href]="e.epique" target="_blank" rel="noopener noreferrer">
              Épique Notion <svg lucideExternalLink [strokeWidth]="1.5" aria-hidden="true"></svg>
              <span class="lecteur">(nouvel onglet)</span>
            </a>
          }
        </div>
        <button #ouvrir socButton type="button" variant="secondary" (click)="ouvrirPleinEcran()">
          <svg lucideMaximize2 socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
          Plein écran
        </button>
      </header>
      <code class="route">{{ nomProduit() }} · {{ e.route }}</code>

      <div
        class="cadre"
        [class.plein-ecran]="pleinEcran()"
        [attr.role]="pleinEcran() ? 'dialog' : null"
        [attr.aria-modal]="pleinEcran() ? 'true' : null"
        [attr.aria-label]="pleinEcran() ? e.titre + ' en plein écran' : null"
      >
        @if (pleinEcran()) {
          <div class="barre">
            <span class="barre-titre">{{ e.titre }}</span>
            <button #quitter socButton type="button" variant="secondary" (click)="quitterPleinEcran()">
              <svg lucideMinimize2 socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
              Quitter le plein écran
            </button>
          </div>
        }
        <div class="zone">
          @if (!charge()) {
            <!-- Squelette de l'enveloppe (le kit n'a pas de Skeleton) : silhouette du shell du prototype. -->
            <div class="squelette" role="status" aria-live="polite">
              <span class="lecteur">Chargement du prototype…</span>
              <span class="menu" aria-hidden="true"></span>
              <span class="contenu" aria-hidden="true">
                <span class="ligne titre-squelette"></span>
                <span class="ligne"></span>
                <span class="ligne courte"></span>
                <span class="bloc"></span>
              </span>
            </div>
          }
          <iframe
            [src]="src()"
            [title]="'Prototype : ' + e.titre"
            allow="clipboard-write"
            [attr.aria-hidden]="charge() ? null : 'true'"
            (load)="surChargement($event)"
          ></iframe>
        </div>
      </div>
    } @else {
      <h1>Écran introuvable</h1>
      <p class="intro">Aucun écran « {{ ecranId() }} » dans le produit « {{ produit() }} ».</p>
    }
  `,
  styleUrls: ['./page.scss', './ecran-page.component.scss'],
})
export class EcranPageComponent {
  readonly produit = input.required<string>();
  readonly ecranId = input.required<string>({ alias: 'ecran' });

  readonly fiche = computed(() => ecran(this.produit(), this.ecranId()));
  readonly nomProduit = computed(() => produit(this.produit())?.nom ?? '');
  readonly statuts = STATUTS_ECRAN;
  readonly pleinEcran = signal(false);
  /** Vrai une fois le document du prototype chargé dans l'iframe. */
  readonly charge = signal(false);

  private readonly sanitizer = inject(DomSanitizer);
  // Adresse construite depuis une fiche (PROTOTYPES_URL + route), jamais depuis une saisie.
  readonly src = computed(() => {
    const f = this.fiche();
    return f ? this.sanitizer.bypassSecurityTrustResourceUrl(urlPrototype(f)) : null;
  });

  private readonly boutonOuvrir = viewChild('ouvrir', { read: ElementRef<HTMLButtonElement> });
  private readonly boutonQuitter = viewChild('quitter', { read: ElementRef<HTMLButtonElement> });

  constructor() {
    const titre = inject(Title);
    effect(() => titre.setTitle(`${this.fiche()?.titre ?? 'Écran introuvable'} — Prototypes — Socium Design Hub`));

    // Un autre écran (même composant, autre fiche) : la nouvelle page se charge, on remontre le squelette.
    effect(() => {
      this.src();
      this.charge.set(false);
    });

    // Plein écran : la page du hub ne défile plus derrière le calque, le focus va au bouton « Quitter ».
    effect(() => {
      const actif = this.pleinEcran();
      document.body.style.overflow = actif ? 'hidden' : '';
      if (actif) queueMicrotask(() => this.boutonQuitter()?.nativeElement.focus());
    });
    inject(DestroyRef).onDestroy(() => (document.body.style.overflow = ''));
  }

  /**
   * L'iframe émet d'abord « load » pour about:blank (document lisible, même origine) ; le prototype, servi depuis une
   * autre origine, n'est plus lisible : c'est ce chargement-là qui retire le squelette.
   */
  surChargement(event: Event): void {
    const fenetre = (event.target as HTMLIFrameElement).contentWindow;
    try {
      if (fenetre?.location.href === 'about:blank') return;
    } catch {
      // Autre origine : le prototype est chargé.
    }
    this.charge.set(true);
  }

  ouvrirPleinEcran(): void {
    this.pleinEcran.set(true);
  }

  quitterPleinEcran(): void {
    if (!this.pleinEcran()) return;
    this.pleinEcran.set(false);
    queueMicrotask(() => this.boutonOuvrir()?.nativeElement.focus());
  }
}
