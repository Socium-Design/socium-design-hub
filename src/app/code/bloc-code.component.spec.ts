import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocCodeComponent } from './bloc-code.component';
import { THEME_CODE } from './theme-code';

describe('BlocCodeComponent', () => {
  let fixture: ComponentFixture<BlocCodeComponent>;
  let ref: ComponentRef<BlocCodeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocCodeComponent);
    ref = fixture.componentRef;
    ref.setInput('code', "const a = '<b>';");
    ref.setInput('langage', 'typescript');
    ref.setInput('fichier', 'exemple.ts');
    fixture.detectChanges();
  });

  it('affiche le nom du fichier et le code, puis le colore avec Shiki', async () => {
    const hote = fixture.nativeElement as HTMLElement;
    expect(hote.querySelector('.fichier')?.textContent).toBe('exemple.ts');
    expect(hote.querySelector('pre')?.textContent).toBe("const a = '<b>';");

    await new Promise<void>((fin) => {
      const attendre = () => (fixture.componentInstance.html() ? fin() : setTimeout(attendre, 50));
      attendre();
    });
    fixture.detectChanges();
    expect(hote.querySelector('pre.shiki')).not.toBeNull();
    expect(hote.querySelector('pre')?.textContent).toBe("const a = '<b>';");
    expect(hote.querySelector('b')).toBeNull();
  });

  it('copie le code', async () => {
    const ecrire = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await new Promise((fin) => setTimeout(fin));
    fixture.detectChanges();
    expect(ecrire).toHaveBeenCalledWith("const a = '<b>';");
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Copié');
  });

  it('ne garde aucune couleur de texte sous 4,5:1 sur le fond', () => {
    const lum = (h: string) => {
      const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
      const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: string, b: string) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    for (const couleur of [THEME_CODE.texte, ...Object.values(THEME_CODE.remplacements)]) {
      expect(ratio(couleur, THEME_CODE.fond)).withContext(couleur).toBeGreaterThanOrEqual(4.5);
    }
    expect(ratio(THEME_CODE.enteteTexte, THEME_CODE.enteteFond)).toBeGreaterThanOrEqual(4.5);
  });
});
