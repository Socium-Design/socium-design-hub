import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'composants' },
  {
    path: 'composants',
    title: 'Composants — Socium Design Hub',
    loadComponent: () =>
      import('./sections/composants/composants-page.component').then((m) => m.ComposantsPageComponent),
  },
  {
    path: 'prototypes',
    title: 'Prototypes — Socium Design Hub',
    loadComponent: () =>
      import('./sections/prototypes/prototypes-page.component').then((m) => m.PrototypesPageComponent),
  },
  { path: '**', redirectTo: 'composants' },
];
