import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SocTabs, TabItem } from '@socium-design/angular-components';
import { filter, map } from 'rxjs';

/** Shell du hub : titre + onglets du kit. La section active est dérivée de l'URL, jamais stockée. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SocTabs],
  template: `
    <header class="hub-header">
      <span class="hub-title">Socium Design Hub</span>
      <nav aria-label="Sections">
        <soc-tabs [items]="sections" [value]="sectionActive()" (change)="ouvrir($event)" />
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly sections: TabItem[] = [
    { id: 'composants', label: 'Composants' },
    { id: 'prototypes', label: 'Prototypes' },
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly sectionActive = computed(() => {
    const premier = this.url().split(/[/?#]/)[1];
    return this.sections.find((s) => s.id === premier)?.id ?? this.sections[0].id;
  });

  ouvrir(id: string): void {
    this.router.navigate(['/', id]);
  }
}
