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
      <div class="exemples" [class.seul]="exemples().length === 1" [class.champ]="largeur() === 'champ'">
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
  readonly largeur = signal<'contenu' | 'champ'>('contenu');

  private readonly hote = inject<ElementRef<HTMLElement>>(ElementRef);
  private derniereHauteur = 0;

  constructor() {
    const ecouter = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== window.parent || !estMessageApercu(event.data)) return;
      if (event.data.type === 'rendu') {
        this.exemples.set(event.data.exemples);
        this.legendes.set(event.data.legendes);
        this.largeur.set(event.data.largeur);
      }
    };
    window.addEventListener('message', ecouter);

    // La hauteur n'est envoyée qu'une fois des exemples rendus : la page parente affiche son squelette jusque-là.
    // Elle couvre aussi les calques ouverts dans <body> (liste d'un select, popover) pour qu'ils ne soient pas coupés.
    const mesurer = () => {
      if (!this.gabarit() || !this.exemples().length) return;
      const racine = this.hote.nativeElement.closest('app-root');
      const calques = [...document.body.children].filter(
        (e): e is HTMLElement =>
          e instanceof HTMLElement &&
          e !== racine &&
          e.tagName !== 'SCRIPT' &&
          // Le panneau du popover reste dans <body>, masqué, quand il est fermé.
          getComputedStyle(e).visibility !== 'hidden' &&
          getComputedStyle(e).display !== 'none',
      );
      // Le popover du kit s'ouvre vers le haut quand la place manque en dessous, et se replace quand la fenêtre change de
      // taille : on réserve sous le contenu la hauteur du calque, l'iframe s'agrandit et la liste s'ouvre en dessous.
      const contenu = this.hote.nativeElement.offsetHeight;
      const bas = Math.max(
        contenu,
        ...calques.map((c) => Math.ceil(Math.max(c.getBoundingClientRect().bottom + window.scrollY, contenu + c.offsetHeight))),
      );
      if (bas !== this.derniereHauteur) {
        this.derniereHauteur = bas;
        this.envoyer({ canal: CANAL, type: 'hauteur', hauteur: bas });
      }
    };
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(this.hote.nativeElement);
    const mutations = new MutationObserver(() => requestAnimationFrame(mesurer));
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('message', ecouter);
      observateur.disconnect();
      mutations.disconnect();
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
