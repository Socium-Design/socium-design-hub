import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { ECRANS, PROTOTYPES_URL } from './ecrans';
import { EcranPageComponent } from './pages/ecran-page.component';
import { PRODUITS } from './produits';

describe('Fiches des prototypes', () => {
  it('rattache chaque écran à un produit, avec un identifiant unique et une route de sirh_prototype', () => {
    const ids = new Set<string>();
    for (const e of ECRANS) {
      expect(PRODUITS.some((p) => p.id === e.produit)).withContext(e.id).toBeTrue();
      expect(e.route).withContext(e.id).toMatch(/^\/[a-z]/);
      expect(ids.has(`${e.produit}/${e.id}`)).withContext(e.id).toBeFalse();
      ids.add(`${e.produit}/${e.id}`);
    }
  });

  it('n’a pas d’autre lien externe que les épiques Notion', () => {
    for (const e of ECRANS) {
      if (e.epique) expect(e.epique).withContext(e.id).toMatch(/^https:\/\/app\.notion\.com\/p\/[0-9a-f]{32}$/);
    }
    expect(PROTOTYPES_URL).toBe('https://sirh-prototype.vercel.app');
  });
});

describe('Pages Prototypes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] }));

  async function ouvrir(url: string) {
    const harness = await RouterTestingHarness.create(url);
    return { harness, page: harness.routeNativeElement as HTMLElement };
  }

  it('affiche une carte par produit, avec le nombre d’écrans ou « Bientôt »', async () => {
    const { page } = await ouvrir('/prototypes');
    const cartes = [...page.querySelectorAll('.carte')];
    expect(cartes.map((c) => c.querySelector('h2')?.textContent)).toEqual(PRODUITS.map((p) => p.nom));
    expect(cartes[0].textContent).toContain('8 écrans');
    expect(cartes[1].textContent).toContain('5 écrans');
    expect(cartes[0].tagName).toBe('A');
    expect(cartes[2].tagName).toBe('DIV');
    expect(cartes[2].textContent).toContain('Bientôt');
    // Workspace n'a pas d'illustration : dégradé avec le glyphe en grand.
    expect(cartes[0].querySelector('.illustration.degrade soc-app-icon-glyph')).not.toBeNull();
    expect(cartes[1].textContent).toContain('Pilotez les performances et suivez les évaluations de vos équipes.');
    expect(cartes[1].querySelector('img')?.getAttribute('src')).toBe('illustrations/performance.svg');
  });

  it('liste les écrans d’un produit avec statut et épique', async () => {
    const { page } = await ouvrir('/prototypes/workspace');
    const lignes = [...page.querySelectorAll('tbody tr')];
    expect(lignes.length).toBe(8);
    const employes = lignes[0];
    expect(employes.textContent).toContain('Employés');
    expect(employes.textContent).toContain('—');
    const populations = lignes.find((l) => l.textContent?.includes('Populations'))!;
    expect(populations.textContent).toContain('En dev');
    expect(populations.querySelector('a.externe')?.getAttribute('href')).toContain('3db15b630f928082b342c2a6b39f463c');
  });

  it('montre « Bientôt » pour un produit sans écran', async () => {
    const { page } = await ouvrir('/prototypes/payroll');
    expect(page.textContent).toContain('Aucun écran prototypé');
  });

  it('charge l’écran dans une iframe et passe en plein écran sans quitter le hub', async () => {
    const { harness, page } = await ouvrir('/prototypes/performance/objectifs-creation');
    expect(page.querySelector('h1')?.textContent).toBe("Création d'un objectif");
    const iframe = page.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('https://sirh-prototype.vercel.app/perf/objectifs/nouveau');
    // Squelette tant que le prototype n'est pas chargé (le test charge la vraie adresse : on remet l'état à zéro).
    const composant = harness.fixture.debugElement.query(By.directive(EcranPageComponent))
      .componentInstance as EcranPageComponent;
    composant.charge.set(false);
    harness.detectChanges();
    expect(page.querySelector('.squelette')?.textContent).toContain('Chargement du prototype');
    // Le « load » d'about:blank est ignoré…
    composant.surChargement({ target: { contentWindow: { location: { href: 'about:blank' } } } } as unknown as Event);
    harness.detectChanges();
    expect(page.querySelector('.squelette')).not.toBeNull();
    // … celui du prototype (autre origine, document illisible) retire le squelette.
    const autreOrigine = {
      get location(): Location {
        throw new DOMException('Blocked a frame with origin', 'SecurityError');
      },
    };
    composant.surChargement({ target: { contentWindow: autreOrigine } } as unknown as Event);
    harness.detectChanges();
    expect(page.querySelector('.squelette')).toBeNull();

    const bouton = [...page.querySelectorAll('button')].find((b) => b.textContent?.includes('Plein écran'))!;
    bouton.click();
    harness.detectChanges();
    const cadre = page.querySelector('.cadre')!;
    expect(cadre.classList).toContain('plein-ecran');
    expect(cadre.getAttribute('role')).toBe('dialog');
    expect(page.querySelector('iframe')).toBe(iframe);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    harness.detectChanges();
    expect(cadre.classList).not.toContain('plein-ecran');
    expect(document.body.style.overflow).toBe('');
  });

  it('signale un écran inconnu', async () => {
    const { page } = await ouvrir('/prototypes/performance/inconnu');
    expect(page.querySelector('h1')?.textContent).toBe('Écran introuvable');
  });
});
