import { Component, input } from '@angular/core';
import { SocTag } from '@socium-design/angular-components';
import { Valeurs } from '../../fiche.model';

/** Gabarit d'aperçu de soc-tag, rendu dans l'iframe. */
@Component({
  selector: 'app-tag-apercu',
  imports: [SocTag],
  template: `
    @let v = valeurs();
    <soc-tag [color]="$any(v['color'])" [size]="$any(v['size'])" [removable]="v['removable'] === true">
      {{ v['label'] }}
    </soc-tag>
  `,
})
export class TagApercuComponent {
  readonly valeurs = input.required<Valeurs>();
}
