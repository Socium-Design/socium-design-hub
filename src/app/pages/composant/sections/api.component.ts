import { Component, computed, input } from '@angular/core';
import { ApiComposant, typesCites } from '../../../catalogue/api-kit';
import { BlocCodeComponent } from '../../../code/bloc-code.component';

@Component({
  selector: 'app-api',
  imports: [BlocCodeComponent],
  template: `
    @let a = api();
    @if (estAttribut()) {
      <p class="note">
        Sélecteur d'attribut sur un élément natif : ses attributs et événements (<code>type</code>,
        <code>disabled</code>, <code>(click)</code>, <code>aria-label</code>…) s'utilisent tels quels.
      </p>
    }

    <h3>Inputs</h3>
    @if (a.inputs.length) {
      <div class="carte defile" tabindex="0" role="region" aria-label="Inputs">
        <table>
          <thead>
            <tr>
              <th>Nom</th><th>Type</th>
              @if (colonnes().defaut) { <th>Défaut</th> }
              @if (colonnes().requis) { <th>Requis</th> }
              @if (colonnes().description) { <th>Description</th> }
            </tr>
          </thead>
          <tbody>
            @for (m of a.inputs; track m.name) {
              <tr>
                <td><code>{{ m.name }}</code>@if (m.twoWay) { <span class="liaison" title="Liaison bidirectionnelle">↔</span> }</td>
                <td><code>{{ m.type }}</code></td>
                @if (colonnes().defaut) { <td><code>{{ m.default ?? '—' }}</code></td> }
                @if (colonnes().requis) { <td>{{ m.required ? 'oui' : '' }}</td> }
                @if (colonnes().description) { <td class="texte">{{ m.doc }}</td> }
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="vide">Aucun input.</p>
    }

    <h3>Outputs</h3>
    @if (a.outputs.length) {
      <div class="carte defile" tabindex="0" role="region" aria-label="Outputs">
        <table>
          <thead>
            <tr><th>Nom</th><th>Payload</th>@if (descriptionOutputs()) { <th>Description</th> }</tr>
          </thead>
          <tbody>
            @for (m of a.outputs; track m.name) {
              <tr>
                <td><code>({{ m.name }})</code></td>
                <td><code>{{ m.type }}</code></td>
                @if (descriptionOutputs()) { <td class="texte">{{ m.doc }}</td> }
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="vide">Aucun output déclaré.</p>
    }

    <h3>Slots</h3>
    @if (a.slots.length) {
      <div class="carte defile" tabindex="0" role="region" aria-label="Slots">
        <table>
          <thead><tr><th>Marqueur</th><th>Rôle</th></tr></thead>
          <tbody>
            @for (s of a.slots; track s.selector) {
              <tr>
                <td><code>{{ s.selector === 'default' ? '(contenu par défaut)' : s.selector }}</code></td>
                <td class="texte">{{ roles()[s.selector] }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="vide">Aucun slot.</p>
    }

    @if (types().length) {
      <h3>Types</h3>
      <app-bloc-code [code]="codeTypes()" langage="typescript" [fichier]="fichier()" />
    }

    <details>
      <summary>Notes du kit (en anglais)</summary>
      <p>{{ a.description }}</p>
      @for (s of slotsDecrits(); track s.selector) {
        <p><code>{{ s.selector }}</code> — {{ s.description }}</p>
      }
    </details>
  `,
  styleUrls: ['./section.scss', './api.component.scss'],
})
export class ApiComponent {
  readonly api = input.required<ApiComposant>();
  /** Rôles courts des slots, écrits dans la fiche. */
  readonly roles = input.required<Record<string, string>>();

  readonly types = computed(() => typesCites(this.api()));
  readonly codeTypes = computed(() => this.types().map((t) => t.text).join('\n'));
  readonly fichier = computed(() => this.api().file.split('/').pop() ?? '');
  readonly estAttribut = computed(() => this.api().selector.includes('['));
  readonly slotsDecrits = computed(() => this.api().slots.filter((s) => s.description));

  // Une colonne vide pour tous les inputs n'est pas affichée.
  readonly colonnes = computed(() => {
    const inputs = this.api().inputs;
    return {
      defaut: inputs.some((m) => m.default !== undefined),
      requis: inputs.some((m) => m.required),
      description: inputs.some((m) => m.doc),
    };
  });
  readonly descriptionOutputs = computed(() => this.api().outputs.some((m) => m.doc));
}
