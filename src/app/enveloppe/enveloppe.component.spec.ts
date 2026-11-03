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
    const liens = [...page.querySelectorAll('app-barre-laterale a')].map((a) => a.textContent?.replace(/\s+/g, ' ').trim());
    expect(liens).toEqual([
      'Socium Design Hub',
      'Démarrer',
      'Button',
      'Champ texte',
      'Select',
      'Tabs',
      'Tag',
      'Prototypes',
      'Workspace 8',
      'Performance 5',
    ]);
    const bientot = [...page.querySelectorAll('app-barre-laterale .inactif')].map((s) => s.textContent?.replace(/\s+/g, ' ').trim());
    expect(bientot).toEqual(['Payroll Bientôt', 'Workflow Bientôt', 'Doc Bientôt', 'Job Bientôt', 'Time Bientôt']);
    const categories = [...page.querySelectorAll('app-barre-laterale .categorie')].map((c) => c.textContent);
    expect(categories).toEqual(['Actions', 'Saisie', 'Sélection', 'Navigation', 'Feedback']);
    expect(page.querySelector('app-en-tete')?.textContent).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('ouvre et ferme la barre latérale avec le bouton Menu, puis la ferme à la navigation', async () => {
    const harness = await RouterTestingHarness.create('/demarrer');
    const page = harness.fixture.nativeElement as HTMLElement;
    const enveloppe = page.querySelector('app-enveloppe') as HTMLElement;
    const menu = page.querySelector('button.menu') as HTMLButtonElement;
    expect(menu.getAttribute('aria-expanded')).toBe('false');

    menu.click();
    harness.detectChanges();
    expect(enveloppe.classList).toContain('menu-ouvert');
    expect(menu.getAttribute('aria-expanded')).toBe('true');

    await harness.navigateByUrl('/composants/button');
    expect(enveloppe.classList).not.toContain('menu-ouvert');
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

  it('vide la recherche et ferme les résultats avec Échap', async () => {
    const harness = await RouterTestingHarness.create('/demarrer');
    const page = harness.fixture.nativeElement as HTMLElement;
    const champ = page.querySelector('app-en-tete input') as HTMLInputElement;
    champ.value = 'butt';
    champ.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(page.querySelector('.resultats')).not.toBeNull();

    champ.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(champ.value).toBe('');
    expect(page.querySelector('.resultats')).toBeNull();
  });
});

describe('rechercher', () => {
  it('cherche par titre, nom de classe ou sélecteur, sans casse', () => {
    for (const q of ['butt', 'SocButton', 'button[socbutton]']) expect(rechercher([BUTTON], q)).toEqual([BUTTON]);
    expect(rechercher([BUTTON], 'tableau')).toEqual([]);
    expect(rechercher([BUTTON], '  ')).toEqual([]);
  });
});
