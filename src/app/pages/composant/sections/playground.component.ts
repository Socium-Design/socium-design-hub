import { Component, computed, input, linkedSignal } from '@angular/core';
import { SelectOption, SocInputText, SocSelect, SocSwitch } from '@socium-design/angular-components';
import { ApercuFrameComponent } from '../../../apercu/apercu-frame.component';
import { codeAngular } from '../../../catalogue/code-angular';
import { FicheComposant, Reglage, nomTechnique } from '../../../catalogue/fiche.model';
import { optionsReglage, valeursParDefaut } from '../../../catalogue/reglages';
import { BlocCodeComponent } from '../../../code/bloc-code.component';

@Component({
  selector: 'app-playground',
  imports: [ApercuFrameComponent, BlocCodeComponent, SocSelect, SocInputText, SocSwitch],
  template: `
    <div class="carte">
      <div class="haut">
        <app-apercu-frame class="apercu" [composant]="fiche().id" [exemples]="exemple()" [titre]="'Aperçu de ' + fiche().titre" />
        <form class="reglages" aria-label="Réglages" (submit)="$event.preventDefault()">
          @for (reglage of fiche().reglages; track reglage.cle) {
            <div class="reglage" [class.ligne]="reglage.controle === 'interrupteur'">
              @switch (reglage.controle) {
                @case ('select') {
                  <soc-select
                    [label]="reglage.libelle"
                    [options]="options(reglage)"
                    [value]="texte(reglage.cle)"
                    (valueChange)="changer(reglage.cle, $event)"
                  />
                }
                @case ('texte') {
                  <soc-input-text
                    [label]="reglage.libelle"
                    [value]="texte(reglage.cle)"
                    (valueChange)="changer(reglage.cle, $event)"
                  />
                }
                @case ('interrupteur') {
                  <soc-switch
                    [label]="reglage.libelle"
                    [checked]="valeurs()[reglage.cle] === true"
                    (checkedChange)="changer(reglage.cle, $event)"
                  />
                }
              }
              <code class="technique" aria-hidden="true">{{ technique(reglage) }}</code>
            </div>
          }
        </form>
      </div>
      <app-bloc-code class="code" [code]="code()" langage="angular-ts" fichier="exemple.component.ts" />
    </div>
  `,
  styleUrls: ['./section.scss', './playground.component.scss'],
})
export class PlaygroundComponent {
  readonly fiche = input.required<FicheComposant>();

  readonly valeurs = linkedSignal(() => valeursParDefaut(this.fiche()));
  readonly exemple = computed(() => [{ id: 'playground', titre: this.fiche().titre, valeurs: this.valeurs() }]);
  readonly code = computed(() => codeAngular(this.fiche(), this.valeurs()));

  options(reglage: Reglage): SelectOption[] {
    return optionsReglage(this.fiche(), reglage).map((v) => ({ value: v, label: v }));
  }

  technique(reglage: Reglage): string {
    return nomTechnique(reglage);
  }

  texte(cle: string): string {
    return String(this.valeurs()[cle] ?? '');
  }

  changer(cle: string, valeur: string | boolean | undefined): void {
    this.valeurs.update((v) => ({ ...v, [cle]: valeur ?? '' }));
  }
}
