import { Component, input } from '@angular/core';
import { SelectOption, SocSelect } from '@socium-design/angular-components';
import { Valeurs } from '../../fiche.model';
import { SELECT } from './select.fiche';

/** Gabarit d'aperçu de soc-select, rendu dans l'iframe. */
@Component({
  selector: 'app-select-apercu',
  imports: [SocSelect],
  template: `
    @let v = valeurs();
    <soc-select
      [options]="options"
      [mode]="$any(v['mode'])"
      [label]="$any(v['label'])"
      [placeholder]="$any(v['placeholder'])"
      [helperText]="$any(v['helperText'])"
      [value]="$any(v['value']) || undefined"
      [disabled]="v['disabled'] === true"
      [required]="v['required'] === true"
      [error]="v['error'] === true"
      [warning]="v['warning'] === true"
    />
  `,
})
export class SelectApercuComponent {
  readonly valeurs = input.required<Valeurs>();
  readonly options = SELECT.donnees![0].valeur as unknown as SelectOption[];
}
