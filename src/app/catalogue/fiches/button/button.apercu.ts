import { Component, computed, input } from '@angular/core';
import { LucideArrowRight, LucidePlus } from '@lucide/angular';
import {
  ButtonSize,
  ButtonVariant,
  SocButton,
  SocButtonLeftIcon,
  SocButtonRightIcon,
} from '@socium-design/angular-components';
import { Valeurs } from '../../fiche.model';

/** Gabarit d'aperçu de soc-button, rendu dans l'iframe. Le seul morceau de la page écrit à la main. */
@Component({
  selector: 'app-button-apercu',
  imports: [SocButton, SocButtonLeftIcon, SocButtonRightIcon, LucidePlus, LucideArrowRight],
  template: `
    <button socButton type="button" [variant]="variant()" [size]="size()" [disabled]="valeurs()['disabled'] === true">
      @if (valeurs()['iconeGauche'] === true) {
        <svg lucidePlus socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
      }
      {{ valeurs()['label'] }}
      @if (valeurs()['iconeDroite'] === true) {
        <svg lucideArrowRight socButtonRightIcon class="size-full" [strokeWidth]="1.5"></svg>
      }
    </button>
  `,
})
export class ButtonApercuComponent {
  readonly valeurs = input.required<Valeurs>();
  readonly variant = computed(() => this.valeurs()['variant'] as ButtonVariant);
  readonly size = computed(() => this.valeurs()['size'] as ButtonSize);
}
