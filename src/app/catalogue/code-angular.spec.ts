import { codeAngular } from './code-angular';
import { BUTTON } from './fiches/button/button.fiche';
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
    expect(code).toContain('<button socButton type="button" variant="danger" size="lg" disabled>');
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

  it('échappe le libellé', () => {
    expect(codeAngular(BUTTON, { ...defaut, label: '<b>Oui</b>' })).toContain('&lt;b&gt;Oui&lt;/b&gt;');
  });
});
