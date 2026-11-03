import { composantApi, defautInput } from './api-kit';
import { FicheComposant, ImportCode, Valeurs } from './fiche.model';

function echapperHtml(texte: string): string {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** `button[socButton]` → élément `button` + attribut `socButton` ; `soc-tag` → élément `soc-tag`. */
function hote(selecteur: string): { element: string; attribut?: string } {
  const m = /^([a-z][\w-]*)\[(\w+)\]$/.exec(selecteur);
  return m ? { element: m[1], attribut: m[2] } : { element: selecteur };
}

/** Code Angular complet (imports + composant) qui reproduit l'aperçu avec ces valeurs. */
export function codeAngular(fiche: FicheComposant, valeurs: Valeurs): string {
  const api = composantApi(fiche.composant);
  if (!api) return '';
  const { element, attribut } = hote(api.selector);

  const attributs: string[] = [...(attribut ? [attribut] : []), ...(fiche.attributs ?? [])];
  const imports: ImportCode[] = [{ nom: api.name, depuis: api.entryPoint }];
  const slotsAvant: string[] = [];
  const slotsApres: string[] = [];
  let contenu = '';

  for (const reglage of fiche.reglages) {
    const valeur = valeurs[reglage.cle];
    switch (reglage.type) {
      case 'input': {
        const membre = api.inputs.find((i) => i.name === reglage.cle);
        if (membre && valeur !== defautInput(membre)) attributs.push(`${reglage.cle}="${valeur}"`);
        break;
      }
      case 'natif':
        if (valeur === true) attributs.push(reglage.cle);
        break;
      case 'contenu':
        contenu = echapperHtml(String(valeur ?? ''));
        break;
      case 'slot':
        if (valeur === true) {
          (reglage.position === 'avant' ? slotsAvant : slotsApres).push(reglage.code);
          imports.push(...reglage.imports);
        }
        break;
    }
  }

  const corps = [...slotsAvant, contenu, ...slotsApres].filter(Boolean);
  const ouverture = `<${[element, ...attributs].join(' ')}>`;
  const gabarit = corps.length
    ? [ouverture, ...corps.map((l) => `  ${l}`), `</${element}>`]
    : [`${ouverture}</${element}>`];

  const parSource = new Map<string, string[]>();
  for (const { nom, depuis } of imports) {
    const noms = parSource.get(depuis) ?? [];
    if (!noms.includes(nom)) parSource.set(depuis, [...noms, nom]);
  }
  const lignesImport = [...parSource].map(([depuis, noms]) => `import { ${noms.join(', ')} } from '${depuis}';`);
  const nomsImportes = [...parSource.values()].flat();

  return [
    `import { Component } from '@angular/core';`,
    ...lignesImport,
    '',
    '@Component({',
    `  selector: 'app-exemple',`,
    `  imports: [${nomsImportes.join(', ')}],`,
    '  template: `',
    ...gabarit.map((l) => `    ${l}`),
    '  `,',
    '})',
    'export class ExempleComponent {}',
    '',
  ].join('\n');
}
