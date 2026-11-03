import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import {
  SelectOption,
  SocButton,
  SocButtonLeftIcon,
  SocInputText,
  SocSelect,
  SocSwitch,
} from '@socium-design/angular-components';
import { ApercuFrameComponent } from '../../../apercu/apercu-frame.component';
import { codeAngular } from '../../../catalogue/code-angular';
import { FicheComposant, Reglage } from '../../../catalogue/fiche.model';
import { optionsReglage, valeursParDefaut } from '../../../catalogue/reglages';

@Component({
  selector: 'app-playground',
  imports: [ApercuFrameComponent, SocSelect, SocInputText, SocSwitch, SocButton, SocButtonLeftIcon, LucideCopy, LucideCheck],
  template: `
    <div class="carte">
      <div class="haut">
        <app-apercu-frame class="apercu" [composant]="fiche().id" [exemples]="exemple()" [titre]="'Aperçu de ' + fiche().titre" />
        <form class="reglages" aria-label="Réglages" (submit)="$event.preventDefault()">
          @for (reglage of fiche().reglages; track reglage.cle) {
            @switch (reglage.controle) {
              @case ('select') {
                <soc-select
                  [label]="reglage.cle"
                  [options]="options(reglage)"
                  [value]="texte(reglage.cle)"
                  (valueChange)="changer(reglage.cle, $event)"
                />
              }
              @case ('texte') {
                <soc-input-text
                  [label]="libelle(reglage)"
                  [value]="texte(reglage.cle)"
                  (valueChange)="changer(reglage.cle, $event)"
                />
              }
              @case ('interrupteur') {
                <soc-switch
                  [label]="libelle(reglage)"
                  [checked]="valeurs()[reglage.cle] === true"
                  (checkedChange)="changer(reglage.cle, $event)"
                />
              }
            }
          }
        </form>
      </div>
      <div class="code">
        <div class="code-barre">
          <span>Code Angular</span>
          <button socButton type="button" variant="secondary" (click)="copier()">
            @if (copie()) {
              <svg lucideCheck socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
            } @else {
              <svg lucideCopy socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
            }
            {{ copie() ? 'Copié' : 'Copier' }}
          </button>
        </div>
        <pre><code>{{ code() }}</code></pre>
      </div>
    </div>
  `,
  styleUrls: ['./section.scss', './playground.component.scss'],
})
export class PlaygroundComponent {
  readonly fiche = input.required<FicheComposant>();

  readonly valeurs = linkedSignal(() => valeursParDefaut(this.fiche()));
  readonly exemple = computed(() => [{ id: 'playground', titre: this.fiche().titre, valeurs: this.valeurs() }]);
  readonly code = computed(() => codeAngular(this.fiche(), this.valeurs()));
  readonly copie = signal(false);
  private minuterie?: ReturnType<typeof setTimeout>;

  options(reglage: Reglage): SelectOption[] {
    return optionsReglage(this.fiche(), reglage).map((v) => ({ value: v, label: v }));
  }

  libelle(reglage: Reglage): string {
    return reglage.type === 'input' ? reglage.cle : reglage.libelle;
  }

  texte(cle: string): string {
    return String(this.valeurs()[cle] ?? '');
  }

  changer(cle: string, valeur: string | boolean | undefined): void {
    this.valeurs.update((v) => ({ ...v, [cle]: valeur ?? '' }));
  }

  async copier(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copie.set(true);
    clearTimeout(this.minuterie);
    this.minuterie = setTimeout(() => this.copie.set(false), 2000);
  }
}
