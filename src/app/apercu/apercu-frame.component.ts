import { Component, DestroyRef, ElementRef, booleanAttribute, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Exemple } from '../catalogue/fiche.model';
import { CANAL, MessageApercu, estMessageApercu } from './messages';

/** Iframe d'aperçu isolé : une par section (playground, variantes, états), tous ses exemples y sont rendus. */
@Component({
  selector: 'app-apercu-frame',
  template: `
    @if (hauteur() === null) {
      <div class="squelette" role="status" aria-live="polite">
        <span class="lecteur">Chargement de l'aperçu…</span>
        @for (exemple of exemples(); track exemple.id) {
          <div class="bloc" aria-hidden="true">
            <span class="forme"></span>
            @if (legendes()) {
              <span class="legende"></span>
            }
          </div>
        }
      </div>
    }
    <iframe #cadre [src]="src()" [title]="titre()" [style.height.px]="hauteur() ?? 0" [attr.aria-hidden]="hauteur() === null"></iframe>
  `,
  styleUrl: './apercu-frame.component.scss',
})
export class ApercuFrameComponent {
  readonly composant = input.required<string>();
  readonly exemples = input.required<Exemple[]>();
  readonly titre = input.required<string>();
  readonly legendes = input(false, { transform: booleanAttribute });
  readonly largeur = input<'contenu' | 'champ'>('contenu');

  private readonly cadre = viewChild.required<ElementRef<HTMLIFrameElement>>('cadre');
  private readonly sanitizer = inject(DomSanitizer);
  private readonly pret = signal(false);

  readonly hauteur = signal<number | null>(null);
  // Chemin interne construit depuis l'id d'une fiche, jamais depuis une saisie.
  readonly src = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`/apercu/${encodeURIComponent(this.composant())}`),
  );

  constructor() {
    const ecouter = (event: MessageEvent) => {
      const fenetre = this.cadre().nativeElement.contentWindow;
      if (event.origin !== location.origin || event.source !== fenetre || !estMessageApercu(event.data)) return;
      if (event.data.type === 'pret') this.pret.set(true);
      if (event.data.type === 'hauteur') this.hauteur.set(event.data.hauteur);
    };
    window.addEventListener('message', ecouter);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('message', ecouter));

    // L'iframe change de composant : on attend son nouveau « prêt ».
    effect(() => {
      this.composant();
      this.pret.set(false);
      this.hauteur.set(null);
    });

    effect(() => {
      if (!this.pret()) return;
      this.envoyer({
        canal: CANAL,
        type: 'rendu',
        exemples: this.exemples(),
        legendes: this.legendes(),
        largeur: this.largeur(),
      });
    });
  }

  private envoyer(message: MessageApercu): void {
    this.cadre().nativeElement.contentWindow?.postMessage(message, location.origin);
  }
}
