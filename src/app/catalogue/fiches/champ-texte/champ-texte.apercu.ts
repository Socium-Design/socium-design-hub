import { Component, input } from '@angular/core';
import { LucideInfo, LucideUser } from '@lucide/angular';
import { SocInputText, SocInputTextLeftIcon, SocInputTextRightIcon } from '@socium-design/angular-components';
import { Valeurs } from '../../fiche.model';

/** Gabarit d'aperçu de soc-input-text, rendu dans l'iframe. */
@Component({
  selector: 'app-champ-texte-apercu',
  imports: [SocInputText, SocInputTextLeftIcon, SocInputTextRightIcon, LucideUser, LucideInfo],
  template: `
    @let v = valeurs();
    <soc-input-text
      [label]="$any(v['label'])"
      [placeholder]="$any(v['placeholder'])"
      [helperText]="$any(v['helperText'])"
      [value]="$any(v['value'])"
      [disabled]="v['disabled'] === true"
      [required]="v['required'] === true"
      [error]="v['error'] === true"
      [readonly]="v['readonly'] === true"
    >
      @if (v['iconeGauche'] === true) {
        <svg lucideUser socInputTextLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
      }
      @if (v['iconeDroite'] === true) {
        <svg lucideInfo socInputTextRightIcon class="size-full" [strokeWidth]="1.5"></svg>
      }
    </soc-input-text>
  `,
})
export class ChampTexteApercuComponent {
  readonly valeurs = input.required<Valeurs>();
}
