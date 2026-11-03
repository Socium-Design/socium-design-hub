import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { BUTTON } from '../catalogue/fiches/button/button.fiche';
import { rechercher } from './recherche';

describe('Enveloppe', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] }));

  it('affiche la barre latérale groupée par catégorie et la version du kit', async () => {
    const harness = await RouterTestingHarness.create('/demarrer');
    const page = harness.fixture.nativeElement as HTMLElement;
    const liens = [...page.querySelectorAll('app-barre-laterale a')].map((a) => a.textContent?.trim());
    expect(liens).toEqual(['Socium Design Hub', 'Démarrer', 'Button', 'Tous les prototypes']);
    expect(page.querySelector('app-barre-laterale')?.textContent).toContain('Actions');
    expect(page.querySelector('app-en-tete')?.textContent).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('ouvre le premier résultat de recherche avec Entrée', async () => {
    const harness = await RouterTestingHarness.create('/demarrer');
    const page = harness.fixture.nativeElement as HTMLElement;
    const champ = page.querySelector('app-en-tete input') as HTMLInputElement;
    champ.value = 'socButton';
    champ.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(page.querySelector('.resultats')?.textContent).toContain('button[socButton]');

    champ.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/composants/button');
  });
});

describe('rechercher', () => {
  it('cherche par titre, nom de classe ou sélecteur, sans casse', () => {
    for (const q of ['butt', 'SocButton', 'button[socbutton]']) expect(rechercher([BUTTON], q)).toEqual([BUTTON]);
    expect(rechercher([BUTTON], 'tableau')).toEqual([]);
    expect(rechercher([BUTTON], '  ')).toEqual([]);
  });
});
