import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BarreLateraleComponent } from './barre-laterale.component';
import { EnTeteComponent } from './en-tete.component';

/** Mise en page du hub : barre latérale fixe, en-tête collant, contenu qui défile avec la fenêtre. */
@Component({
  selector: 'app-enveloppe',
  imports: [RouterOutlet, BarreLateraleComponent, EnTeteComponent],
  template: `
    <app-barre-laterale class="barre" />
    <div class="colonne">
      <app-en-tete #entete class="entete" />
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './enveloppe.component.scss',
})
export class EnveloppeComponent {
  private readonly entete = viewChild.required('entete', { read: ElementRef });

  constructor() {
    // Les ancres (#playground…) s'arrêtent sous l'en-tête collant, pas dessous.
    inject(ViewportScroller).setOffset(() => [0, (this.entete().nativeElement as HTMLElement).offsetHeight]);
  }
}
