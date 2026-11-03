import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('Routes du hub', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] }));

  it('redirige la racine vers « Démarrer »', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/demarrer');
    expect(harness.routeNativeElement?.textContent).toContain('Démarrer');
  });

  it('redirige /composants vers la première fiche', async () => {
    await RouterTestingHarness.create('/composants');
    expect(TestBed.inject(Router).url).toBe('/composants/button');
  });
});
