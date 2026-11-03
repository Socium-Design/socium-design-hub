import { Routes } from '@angular/router';
import { CATALOGUE } from './catalogue/catalogue';

export const routes: Routes = [
  {
    path: 'apercu/:id',
    loadComponent: () => import('./apercu/apercu-page.component').then((m) => m.ApercuPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./enveloppe/enveloppe.component').then((m) => m.EnveloppeComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'demarrer' },
      {
        path: 'demarrer',
        title: 'Démarrer — Socium Design Hub',
        loadComponent: () => import('./pages/demarrer/demarrer-page.component').then((m) => m.DemarrerPageComponent),
      },
      { path: 'composants', pathMatch: 'full', redirectTo: `composants/${CATALOGUE[0].fiche.id}` },
      {
        path: 'composants/:id',
        loadComponent: () => import('./pages/composant/composant-page.component').then((m) => m.ComposantPageComponent),
      },
      {
        path: 'prototypes',
        title: 'Prototypes — Socium Design Hub',
        loadComponent: () =>
          import('./prototypes/pages/prototypes-accueil.component').then((m) => m.PrototypesAccueilComponent),
      },
      {
        path: 'prototypes/:produit',
        loadComponent: () => import('./prototypes/pages/produit-page.component').then((m) => m.ProduitPageComponent),
      },
      {
        path: 'prototypes/:produit/:ecran',
        loadComponent: () => import('./prototypes/pages/ecran-page.component').then((m) => m.EcranPageComponent),
      },
      { path: '**', redirectTo: 'demarrer' },
    ],
  },
];
