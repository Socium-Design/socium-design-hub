import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BarreLateraleComponent } from './barre-laterale.component';
import { EnTeteComponent } from './en-tete.component';

/**
 * Mise en page du hub : barre latérale fixe, en-tête collant, contenu qui défile avec la fenêtre.
 * Sous 1024 px, la barre latérale se replie et s'ouvre par le bouton « Menu » de l'en-tête.
 */
@Component({
  selector: 'app-enveloppe',
  imports: [RouterOutlet, BarreLateraleComponent, EnTeteComponent],
  host: {
    '[class.menu-ouvert]': 'menuOuvert()',
    '(document:keydown.escape)': 'menuOuvert.set(false)',
  },
  template: `
    <app-barre-laterale id="barre-laterale" class="barre" />
    <div class="voile" (click)="menuOuvert.set(false)" aria-hidden="true"></div>
    <div class="colonne">
      <app-en-tete #entete class="entete" [menuOuvert]="menuOuvert()" (basculerMenu)="menuOuvert.set(!menuOuvert())" />
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './enveloppe.component.scss',
})
export class EnveloppeComponent {
  private readonly entete = viewChild.required('entete', { read: ElementRef });
  readonly menuOuvert = signal(false);

  constructor() {
    // Les ancres (#playground…) s'arrêtent sous l'en-tête collant, pas dessous.
    inject(ViewportScroller).setOffset(() => [0, (this.entete().nativeElement as HTMLElement).offsetHeight]);

    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOuvert.set(false));
  }
}
