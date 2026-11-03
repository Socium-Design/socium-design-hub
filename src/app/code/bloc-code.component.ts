import { Component, ViewEncapsulation, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideCheck, LucideCopy } from '@lucide/angular';
import { SocButton, SocButtonLeftIcon } from '@socium-design/angular-components';
import { surligner } from './surligneur';
import { LangageCode, THEME_CODE } from './theme-code';

/** Bloc de code à la VS Code : en-tête (nom du fichier + Copier), coloration Shiki Dark+. */
@Component({
  selector: 'app-bloc-code',
  imports: [SocButton, SocButtonLeftIcon, LucideCopy, LucideCheck],
  // Le HTML de Shiki est injecté : styles non encapsulés, tous préfixés par app-bloc-code.
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.--code-fond]': 'theme.fond',
    '[style.--code-texte]': 'theme.texte',
    '[style.--code-entete-fond]': 'theme.enteteFond',
    '[style.--code-entete-texte]': 'theme.enteteTexte',
    '[style.--code-bordure]': 'theme.bordure',
  },
  template: `
    <div class="entete">
      <span class="fichier">{{ fichier() }}</span>
      <button socButton type="button" variant="secondary" (click)="copier()">
        @if (copie()) {
          <svg lucideCheck socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
        } @else {
          <svg lucideCopy socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>
        }
        {{ copie() ? 'Copié' : 'Copier' }}
      </button>
    </div>
    @if (html(); as html) {
      <div class="contenu" [innerHTML]="html"></div>
    } @else {
      <div class="contenu"><pre><code>{{ code() }}</code></pre></div>
    }
  `,
  styleUrl: './bloc-code.component.scss',
})
export class BlocCodeComponent {
  readonly code = input.required<string>();
  readonly langage = input.required<LangageCode>();
  readonly fichier = input.required<string>();

  readonly theme = THEME_CODE;
  readonly html = signal<SafeHtml | null>(null);
  readonly copie = signal(false);
  private readonly sanitizer = inject(DomSanitizer);
  private minuterie?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const code = this.code();
      // Shiki échappe le code : son HTML ne contient que des <span style="color:…">, d'où la confiance accordée.
      surligner(code, this.langage()).then((html) => {
        if (code === this.code()) this.html.set(this.sanitizer.bypassSecurityTrustHtml(html));
      });
    });
  }

  async copier(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copie.set(true);
    clearTimeout(this.minuterie);
    this.minuterie = setTimeout(() => this.copie.set(false), 2000);
  }
}
