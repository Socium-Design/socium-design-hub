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
  });

  it('met à jour le code quand un réglage change', async () => {
    const harness = await RouterTestingHarness.create('/composants/button');
    const page = harness.routeNativeElement as HTMLElement;
    const champ = page.querySelector('soc-input-text input') as HTMLInputElement;
    champ.value = 'Valider';
    champ.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(page.querySelector('pre code')?.textContent).toContain('Valider');
  });

  it('signale une fiche inconnue', async () => {
    const page = await ouvrir('/composants/inconnu');
    expect(page.querySelector('h1')?.textContent).toBe('Composant introuvable');
  });
});
