import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('ComposantPageComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] }));

  async function ouvrir(url: string): Promise<HTMLElement> {
    const harness = await RouterTestingHarness.create(url);
    return harness.routeNativeElement as HTMLElement;
  }

  it('génère l’en-tête, les sections ancrées et une iframe par section', async () => {
    const page = await ouvrir('/composants/button');
    expect(page.querySelector('h1')?.textContent).toBe('Button');
    expect(page.textContent).toContain('Stable');
    expect(page.querySelector('.selecteur')?.textContent).toBe('button[socButton]');
    expect(page.querySelector('.source')?.getAttribute('href')).toMatch(
      /design_system_angular\/blob\/v[\d.]+\/packages\/angular\/angular-components\/src\/primitifs\/button\/button\.ts$/,
    );
    expect([...page.querySelectorAll('h2')].map((h) => h.id)).toEqual(['playground', 'variantes', 'etats', 'api']);
    expect(page.querySelectorAll('iframe').length).toBe(3);
    expect(page.textContent).toContain('Passez la souris ou utilisez Tab');
  });

  it('remplit l’API depuis le kit', async () => {
    const page = await ouvrir('/composants/button');
    const api = page.querySelector('app-api') as HTMLElement;
    expect(api.textContent).toContain('ButtonVariant');
    expect(api.textContent).toContain('[socButtonLeftIcon]');
    expect(api.textContent).toContain('Aucun output déclaré.');
    expect([...api.querySelectorAll('th')].map((th) => th.textContent)).toEqual(['Nom', 'Type', 'Défaut', 'Marqueur', 'Rôle']);
    const roles = [...api.querySelectorAll('td.texte')].map((td) => td.textContent?.trim());
    expect(roles).toEqual(['Icône avant le libellé', 'Libellé du bouton', 'Icône après le libellé']);
    expect(api.querySelector('app-bloc-code .fichier')?.textContent).toBe('button.ts');
  });

  it('affiche les réglages en français avec leur nom technique', async () => {
    const page = await ouvrir('/composants/button');
    const reglages = [...page.querySelectorAll('.reglage')].map((r) => [
      r.querySelector('soc-select, soc-input-text, soc-switch')?.textContent?.trim().split('\n')[0].trim(),
      r.querySelector('.technique')?.textContent,
    ]);
    expect(reglages.map(([, t]) => t)).toEqual(['variant', 'size', 'contenu', 'disabled', '[socButtonLeftIcon]', '[socButtonRightIcon]']);
    expect(page.querySelector('.reglage')?.textContent).toContain('Variante');
    expect(page.querySelector('app-playground app-bloc-code .fichier')?.textContent).toBe('exemple.component.ts');
  });

  it('montre un squelette tant que les aperçus ne sont pas chargés', async () => {
    const page = await ouvrir('/composants/button');
    const variantes = page.querySelectorAll('app-apercu-frame')[1];
    expect(variantes.querySelectorAll('.squelette .bloc').length).toBe(5);
    expect(variantes.querySelector('.squelette')?.textContent).toContain('Chargement de l’aperçu'.replace('’', "'"));
  });

  it('met à jour le code quand un réglage change', async () => {
    const harness = await RouterTestingHarness.create('/composants/button');
    const page = harness.routeNativeElement as HTMLElement;
    const champ = page.querySelector('soc-input-text input') as HTMLInputElement;
    champ.value = 'Valider';
    champ.dispatchEvent(new Event('input'));
    // La coloration Shiki est asynchrone : on attend que le bloc affiche le nouveau code.
    const code = () => page.querySelector('app-playground app-bloc-code pre')?.textContent ?? '';
    for (let i = 0; i < 60 && !code().includes('Valider'); i++) {
      await new Promise((fin) => setTimeout(fin, 50));
      harness.detectChanges();
    }
    expect(code()).toContain('Valider');
  });

  for (const [id, titre, variantes] of [
    ['champ-texte', 'Champ texte', false],
    ['select', 'Select', true],
    ['tabs', 'Tabs', true],
    ['tag', 'Tag', true],
  ] as const) {
    it(`génère la page ${titre}${variantes ? '' : ' sans section Variantes (pas de variante dans le kit)'}`, async () => {
      const page = await ouvrir(`/composants/${id}`);
      expect(page.querySelector('h1')?.textContent).toBe(titre);
      const sections = [...page.querySelectorAll('h2')].map((h) => h.id);
      expect(sections).toEqual(variantes ? ['playground', 'variantes', 'etats', 'api'] : ['playground', 'etats', 'api']);
      expect(page.querySelectorAll('iframe').length).toBe(variantes ? 3 : 2);
    });
  }

  it('signale une fiche inconnue', async () => {
    const page = await ouvrir('/composants/inconnu');
    expect(page.querySelector('h1')?.textContent).toBe('Composant introuvable');
  });
});
