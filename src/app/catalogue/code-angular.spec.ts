import { codeAngular } from './code-angular';
import { BUTTON } from './fiches/button/button.fiche';
import { CHAMP_TEXTE } from './fiches/champ-texte/champ-texte.fiche';
import { SELECT } from './fiches/select/select.fiche';
import { TABS } from './fiches/tabs/tabs.fiche';
import { TAG } from './fiches/tag/tag.fiche';
import { valeursParDefaut } from './reglages';

describe('codeAngular', () => {
  const defaut = valeursParDefaut(BUTTON);

  it('n’écrit pas les inputs laissés à leur valeur par défaut', () => {
    const code = codeAngular(BUTTON, defaut);
    expect(code).toContain(`import { SocButton } from '@socium-design/angular-components';`);
    expect(code).toContain('<button socButton type="button">');
    expect(code).toContain('  Enregistrer');
    expect(code).not.toContain('variant=');
    expect(code).not.toContain('@lucide/angular');
  });

  it('reflète les réglages : inputs, attribut natif, icônes et leurs imports', () => {
    const code = codeAngular(BUTTON, {
      ...defaut,
      variant: 'danger',
      size: 'lg',
      disabled: true,
      iconeGauche: true,
      iconeDroite: true,
    });
    expect(code).toContain('<button\n      socButton\n      type="button"\n      variant="danger"\n      size="lg"\n      disabled\n    >');
    expect(code).toContain(
      `import { SocButton, SocButtonLeftIcon, SocButtonRightIcon } from '@socium-design/angular-components';`,
    );
    expect(code).toContain(`import { LucidePlus, LucideArrowRight } from '@lucide/angular';`);
    const gauche = code.indexOf('socButtonLeftIcon class');
    const libelle = code.indexOf('Enregistrer');
    const droite = code.indexOf('socButtonRightIcon class');
    expect(gauche).toBeLessThan(libelle);
    expect(libelle).toBeLessThan(droite);
  });

  it('déclare les données fixes et la liaison à un signal (select)', () => {
    const code = codeAngular(SELECT, { ...valeursParDefaut(SELECT), value: 'cdd', error: true });
    expect(code).toContain(`import { Component, signal } from '@angular/core';`);
    expect(code).toContain(`import { SocSelect, SelectOption } from '@socium-design/angular-components';`);
    expect(code).toContain('  imports: [SocSelect],');
    expect(code).toContain('[options]="options"');
    expect(code).toContain('[(value)]="contrat"');
    expect(code).toContain('label="Type de contrat"');
    expect(code).toContain('placeholder="Choisir un type"');
    expect(code).toContain('      error\n');
    expect(code).not.toContain('disabled');
    expect(code).toContain("  readonly options: SelectOption[] = [\n    { value: 'cdi', label: 'CDI' },");
    expect(code).toContain("    { value: 'alternance', label: 'Alternance' },\n  ];");
    expect(code).toContain("  readonly contrat = signal('cdd');");
    expect(code).toMatch(/\n    \/>\n/);
  });

  it('lie l’onglet actif avec son événement (tabs)', () => {
    const code = codeAngular(TABS, valeursParDefaut(TABS));
    expect(code).toContain(`[value]="onglet()" (change)="onglet.set($event)"`);
    expect(code).toContain("{ id: 'archives', label: 'Archives', disabled: true },");
    expect(code).toContain("readonly onglet = signal('apercu');");
  });

  it('ajoute le code lié à un interrupteur actif (tag supprimable)', () => {
    const sans = codeAngular(TAG, valeursParDefaut(TAG));
    expect(sans).toContain('<soc-tag>');
    expect(sans).toContain('export class ExempleComponent {}');
    const avec = codeAngular(TAG, { ...valeursParDefaut(TAG), removable: true, color: 'error' });
    expect(avec).toContain('<soc-tag color="error" removable (remove)="retirer()">');
    expect(avec).toContain('  retirer(): void {}');
  });

  it('n’écrit pas les textes vides (champ texte)', () => {
    const code = codeAngular(CHAMP_TEXTE, valeursParDefaut(CHAMP_TEXTE));
    expect(code).not.toContain('helperText');
    expect(code).toContain("readonly nom = signal('');");
  });

  it('échappe le libellé', () => {
    expect(codeAngular(BUTTON, { ...defaut, label: '<b>Oui</b>' })).toContain('&lt;b&gt;Oui&lt;/b&gt;');
  });
});
