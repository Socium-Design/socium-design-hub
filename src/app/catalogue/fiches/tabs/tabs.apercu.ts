import { Component, input, linkedSignal } from '@angular/core';
import { SocTabs, TabItem } from '@socium-design/angular-components';
import { Valeurs } from '../../fiche.model';
import { TABS } from './tabs.fiche';

/** Gabarit d'aperçu de soc-tabs, rendu dans l'iframe : un clic change l'onglet actif, comme dans une page. */
@Component({
  selector: 'app-tabs-apercu',
  imports: [SocTabs],
  template: `
    <soc-tabs [items]="items" [variant]="$any(valeurs()['variant'])" [value]="onglet()" (change)="onglet.set($event)" />
  `,
})
export class TabsApercuComponent {
  readonly valeurs = input.required<Valeurs>();
  readonly items = TABS.donnees![0].valeur as unknown as TabItem[];
  readonly onglet = linkedSignal(() => String(this.valeurs()['value']));
}
