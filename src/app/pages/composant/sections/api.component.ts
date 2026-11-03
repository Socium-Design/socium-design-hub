import { Component, computed, input } from '@angular/core';
import { ApiComposant, typesCites } from '../../../catalogue/api-kit';

@Component({
  selector: 'app-api',
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
      <div class="carte">
        <table>
          <thead><tr><th>Nom</th><th>Type</th><th>Défaut</th><th>Requis</th><th>Description</th></tr></thead>
          <tbody>
            @for (m of a.inputs; track m.name) {
              <tr>
                <td><code>{{ m.name }}</code>@if (m.twoWay) { <span class="liaison" title="Liaison bidirectionnelle">↔</span> }</td>
                <td><code>{{ m.type }}</code></td>
                <td><code>{{ m.default ?? '—' }}</code></td>
                <td>{{ m.required ? 'oui' : '' }}</td>
                <td>{{ m.doc }}</td>
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
      <div class="carte">
        <table>
          <thead><tr><th>Nom</th><th>Payload</th><th>Description</th></tr></thead>
          <tbody>
            @for (m of a.outputs; track m.name) {
              <tr><td><code>({{ m.name }})</code></td><td><code>{{ m.type }}</code></td><td>{{ m.doc }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      <p class="vide">Aucun output déclaré.</p>
    }

    <h3>Slots</h3>
    @if (a.slots.length) {
      <div class="carte">
        <table>
          <thead><tr><th>Marqueur</th><th>Rôle</th></tr></thead>
          <tbody>
            @for (s of a.slots; track s.selector) {
              <tr>
                <td><code>{{ s.selector === 'default' ? '(contenu par défaut)' : s.selector }}</code></td>
                <td>{{ s.description }}</td>
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
      <div class="carte types">
        @for (t of types(); track t.name) {
          <pre><code>{{ t.text }}</code></pre>
        }
      </div>
    }

    <details>
      <summary>Notes du kit (en anglais)</summary>
      <p>{{ a.description }}</p>
    </details>
  `,
  styleUrls: ['./section.scss', './api.component.scss'],
})
export class ApiComponent {
  readonly api = input.required<ApiComposant>();
  readonly types = computed(() => typesCites(this.api()));
  readonly estAttribut = computed(() => this.api().selector.includes('['));
}
