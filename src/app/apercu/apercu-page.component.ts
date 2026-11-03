import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, ElementRef, Type, inject, input, signal } from '@angular/core';
import { entree } from '../catalogue/catalogue';
import { Exemple } from '../catalogue/fiche.model';
import { CANAL, MessageApercu, estMessageApercu } from './messages';

/**
 * Page chargée dans l'iframe (/apercu/:id), hors de l'enveloppe : seule la feuille du kit s'y applique.
 * Elle reçoit les exemples à rendre de la page parente et lui renvoie sa hauteur.
 */
@Component({
  selector: 'app-apercu-page',
  imports: [NgComponentOutlet],
  template: `
    @if (gabarit(); as gabarit) {
      <div class="exemples" [class.seul]="exemples().length === 1">
        @for (exemple of exemples(); track exemple.id) {
          <figure>
            <div class="rendu">
              <ng-container [ngComponentOutlet]="gabarit" [ngComponentOutletInputs]="{ valeurs: exemple.valeurs }" />
            </div>
            @if (legendes()) {
              <figcaption>{{ exemple.titre }}</figcaption>
            }
          </figure>
        }
      </div>
    }
  `,
  styleUrl: './apercu-page.component.scss',
})
export class ApercuPageComponent {
  readonly id = input.required<string>();

  readonly gabarit = signal<Type<unknown> | null>(null);
  readonly exemples = signal<Exemple[]>([]);
  readonly legendes = signal(false);

  private readonly hote = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const ecouter = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== window.parent || !estMessageApercu(event.data)) return;
      if (event.data.type === 'rendu') {
        this.exemples.set(event.data.exemples);
        this.legendes.set(event.data.legendes);
      }
    };
    window.addEventListener('message', ecouter);

    // La hauteur n'est envoyée qu'une fois des exemples rendus : la page parente affiche son squelette jusque-là.
    const observateur = new ResizeObserver(() => {
      if (this.gabarit() && this.exemples().length) {
        this.envoyer({ canal: CANAL, type: 'hauteur', hauteur: this.hote.nativeElement.offsetHeight });
      }
    });
    observateur.observe(this.hote.nativeElement);

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('message', ecouter);
      observateur.disconnect();
    });
  }

  ngOnInit(): void {
    entree(this.id())
      ?.apercu()
      .then((gabarit) => {
        this.gabarit.set(gabarit);
        this.envoyer({ canal: CANAL, type: 'pret' });
      });
  }

  private envoyer(message: MessageApercu): void {
    if (window.parent !== window) window.parent.postMessage(message, location.origin);
  }
}
