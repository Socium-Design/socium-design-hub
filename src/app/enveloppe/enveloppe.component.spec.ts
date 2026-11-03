import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { BUTTON } from '../catalogue/fiches/button/button.fiche';
import { rechercher } from './recherche';

describe('Enveloppe', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] }));

  const texte = (e: Element) => e.textContent?.replace(/\s+/g, ' ').trim();

  it('affiche les trois niveaux sur une page composant, Prototypes replié', async () => {
    const harness = await RouterTestingHarness.create('/composants/tag');
    const page = harness.fixture.nativeElement as HTMLElement;
    const barre = page.querySelector('app-barre-laterale') as HTMLElement;

    expect([...barre.querySelectorAll('.n1-lien, .n1-titre')].map(texte)).toEqual(['Démarrer', 'Composants', 'Prototypes']);
    expect([...barre.querySelectorAll('#section-composants .n2')].map(texte)).toEqual([
      'Actions',
      'Saisie',
      'Sélection',
      'Navigation',
      'Feedback',
    ]);
    expect([...barre.querySelectorAll('#section-composants .n3')].map(texte)).toEqual([
      'Button',
      'Champ texte',
      'Select',
      'Tabs',
      'Tag',
    ]);
    expect(barre.querySelector('#section-prototypes')).toBeNull();
    expect(barre.querySelector('button[aria-controls="section-prototypes"]')?.getAttribute('aria-expanded')).toBe('false');
    expect(page.querySelector('app-en-tete')?.textContent).toMatch(/v\d+\.\d+\.\d+/);
  });

  it('sur une page prototype, replie Composants et ne déplie que le produit en cours', async () => {
    const harness = await RouterTestingHarness.create('/prototypes/performance/objectifs');
    const barre = harness.fixture.nativeElement.querySelector('app-barre-laterale') as HTMLElement;

    expect(barre.querySelector('#section-composants')).toBeNull();
    expect([...barre.querySelectorAll('#section-prototypes .n2')].map(texte)).toEqual([
      'Workspace 8 écrans',
      'Performance 5 écrans',
      'Payroll Bientôt',
      'Workflow Bientôt',
      'Doc Bientôt',
      'Job Bientôt',
      'Time Bientôt',
    ]);
    expect(barre.querySelector('#produit-workspace')).toBeNull();
    expect(barre.querySelectorAll('#produit-performance .n3').length).toBe(5);

    // Le chevron déplie un autre produit…
    (barre.querySelector('button[aria-controls="produit-workspace"]') as HTMLButtonElement).click();
    harness.detectChanges();
    expect(barre.querySelectorAll('#produit-workspace .n3').length).toBe(8);

    // … et l'état revient au défaut quand on change de produit.
    await harness.navigateByUrl('/prototypes/workspace');
    expect(barre.querySelector('#produit-performance')).toBeNull();
    expect(barre.querySelector('#produit-workspace')).not.toBeNull();
  });

  it('replie et déplie une section avec son chevron', async () => {
    const harness = await RouterTestingHarness.create('/composants/button');
    const barre = harness.fixture.nativeElement.querySelector('app-barre-laterale') as HTMLElement;
    const chevron = barre.querySelector('button[aria-controls="section-prototypes"]') as HTMLButtonElement;

    chevron.click();
    harness.detectChanges();
    expect(chevron.getAttribute('aria-expanded')).toBe('true');
    expect(barre.querySelector('#section-prototypes')).not.toBeNull();

    // Une navigation dans la même section garde ce choix.
    await harness.navigateByUrl('/composants/tag');
    expect(barre.querySelector('#section-prototypes')).not.toBeNull();

    chevron.click();
    harness.detectChanges();
    expect(barre.querySelector('#section-prototypes')).toBeNull();
  });

  it('marque l’élément actif du niveau 3', async () => {
    const harness = await RouterTestingHarness.create('/composants/tag');
    const actif = harness.fixture.nativeElement.querySelector('app-barre-laterale .n3.actif') as HTMLElement;
    expect(actif.textContent?.trim()).toBe('Tag');
    expect(actif.getAttribute('aria-current')).toBe('page');
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
