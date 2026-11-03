import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LucideExternalLink } from '@lucide/angular';
import { SocTag, TagColor } from '@socium-design/angular-components';
import { ApercuFrameComponent } from '../../apercu/apercu-frame.component';
import { composantApi, KIT_VERSION, lienSource } from '../../catalogue/api-kit';
import { entree } from '../../catalogue/catalogue';
import { Statut } from '../../catalogue/fiche.model';
import { exemplesEtats, exemplesVariantes } from '../../catalogue/reglages';
import { ApiComponent } from './sections/api.component';
import { PlaygroundComponent } from './sections/playground.component';

const STATUTS: Record<Statut, { libelle: string; couleur: TagColor }> = {
  stable: { libelle: 'Stable', couleur: 'success' },
  beta: { libelle: 'Bêta', couleur: 'orange' },
  labs: { libelle: 'Labs', couleur: 'purple' },
  deprecated: { libelle: 'Obsolète', couleur: 'error' },
};

/** Page d'un composant, entièrement générée depuis sa fiche et l'API du kit. */
@Component({
  selector: 'app-composant-page',
  imports: [RouterLink, SocTag, LucideExternalLink, ApercuFrameComponent, PlaygroundComponent, ApiComponent],
  template: `
    @if (fiche(); as fiche) {
      @let a = api()!;
      <header class="tete">
        <p class="categorie">Composants · {{ fiche.categorie }}</p>
        <div class="titre">
          <h1>{{ fiche.titre }}</h1>
          <soc-tag [color]="statut().couleur">{{ statut().libelle }}</soc-tag>
          <soc-tag color="information">v{{ version }}</soc-tag>
          <a class="source" [href]="source()" target="_blank" rel="noopener">
            Source GitHub <svg lucideExternalLink class="icone" [strokeWidth]="1.5"></svg>
          </a>
        </div>
        <code class="selecteur">{{ a.selector }}</code>
        <p class="description">{{ fiche.description }}</p>
        <nav class="sommaire" aria-label="Sections de la page">
          <a routerLink="." fragment="playground">Playground</a>
          <a routerLink="." fragment="variantes">Variantes</a>
          <a routerLink="." fragment="etats">États</a>
          <a routerLink="." fragment="api">API</a>
        </nav>
      </header>

      <section aria-labelledby="playground">
        <h2 id="playground">Playground</h2>
        <app-playground [fiche]="fiche" />
      </section>

      <section aria-labelledby="variantes">
        <h2 id="variantes">Variantes</h2>
        <app-apercu-frame
          class="carte"
          [composant]="fiche.id"
          [exemples]="variantes()"
          [titre]="'Variantes de ' + fiche.titre"
          legendes
        />
      </section>

      <section aria-labelledby="etats">
        <h2 id="etats">États</h2>
        <app-apercu-frame class="carte" [composant]="fiche.id" [exemples]="etats()" [titre]="'États de ' + fiche.titre" legendes />
        <p class="aide">Passez la souris ou utilisez Tab sur l'aperçu pour voir le survol et le focus.</p>
      </section>

      <section aria-labelledby="api">
        <h2 id="api">API</h2>
        <app-api [api]="a" />
      </section>
    } @else {
      <h1>Composant introuvable</h1>
      <p class="description">Aucune fiche ne porte l'identifiant « {{ id() }} ».</p>
    }
  `,
  styleUrl: './composant-page.component.scss',
})
export class ComposantPageComponent {
  readonly id = input.required<string>();

  readonly version = KIT_VERSION;
  // Une fiche dont le composant n'existe plus dans le kit est traitée comme introuvable (et un test l'empêche).
  readonly fiche = computed(() => {
    const f = entree(this.id())?.fiche;
    return f && composantApi(f.composant) ? f : undefined;
  });
  readonly api = computed(() => composantApi(this.fiche()?.composant ?? ''));
  readonly statut = computed(() => STATUTS[this.fiche()?.statut ?? 'stable']);
  readonly source = computed(() => {
    const a = this.api();
    return a ? lienSource(a) : '';
  });
  readonly variantes = computed(() => {
    const f = this.fiche();
    return f ? exemplesVariantes(f) : [];
  });
  readonly etats = computed(() => {
    const f = this.fiche();
    return f ? exemplesEtats(f) : [];
  });

  constructor() {
    const titre = inject(Title);
    effect(() => titre.setTitle(`${this.fiche()?.titre ?? 'Composant introuvable'} — Socium Design Hub`));
  }
}
