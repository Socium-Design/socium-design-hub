import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    });
  });

  async function rendre(url: string) {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('redirige la racine vers « Composants » et affiche son titre', async () => {
    const fixture = await rendre('/');
    expect(TestBed.inject(Router).url).toBe('/composants');
    expect(fixture.componentInstance.sectionActive()).toBe('composants');
  });

  it('dérive la section active de l’URL', async () => {
    const fixture = await rendre('/prototypes');
    expect(fixture.componentInstance.sectionActive()).toBe('prototypes');
  });

  it('navigue vers la section choisie dans les onglets', async () => {
    const fixture = await rendre('/composants');
    fixture.componentInstance.ouvrir('prototypes');
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/prototypes');
  });
});
