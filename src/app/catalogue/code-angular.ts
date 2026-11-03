import { composantApi, defautInput } from './api-kit';
import { DonneeFixe, FicheComposant, ImportCode, Valeurs } from './fiche.model';

function echapperHtml(texte: string): string {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function echapperAttribut(texte: string): string {
  return echapperHtml(texte).replace(/"/g, '&quot;');
}

/** Littéral TypeScript entre apostrophes. */
function chaine(texte: string): string {
  return `'${texte.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** `button[socButton]` → élément `button` + attribut `socButton` ; `soc-tag` → élément `soc-tag`. */
function hote(selecteur: string): { element: string; attribut?: string } {
  const m = /^([a-z][\w-]*)\[(\w+)\]$/.exec(selecteur);
  return m ? { element: m[1], attribut: m[2] } : { element: selecteur };
}

/** `readonly options: SelectOption[] = [ … ];`, un élément par ligne. */
function membreDonnee(donnee: DonneeFixe): string[] {
  const elements = donnee.valeur.map((e) => {
    const champs = Object.entries(e).map(([cle, v]) => `${cle}: ${typeof v === 'string' ? chaine(v) : v}`);
    return `  { ${champs.join(', ')} },`;
  });
  return [`readonly ${donnee.input}: ${donnee.type}[] = [`, ...elements, '];'];
}

/** Code Angular complet (imports + composant) qui reproduit l'aperçu avec ces valeurs. */
export function codeAngular(fiche: FicheComposant, valeurs: Valeurs): string {
  const api = composantApi(fiche.composant);
  if (!api) return '';
  const { element, attribut } = hote(api.selector);

  const attributs: string[] = [...(attribut ? [attribut] : []), ...(fiche.attributs ?? [])];
  const imports: ImportCode[] = [{ nom: api.name, depuis: api.entryPoint }];
  const importsCore = ['Component'];
  const membres: string[][] = [];
  const slotsAvant: string[] = [];
  const slotsApres: string[] = [];
  let contenu = '';

  for (const donnee of fiche.donnees ?? []) {
    attributs.push(`[${donnee.input}]="${donnee.input}"`);
    imports.push({ nom: donnee.type, depuis: api.entryPoint });
    membres.push(membreDonnee(donnee));
  }

  for (const reglage of fiche.reglages) {
    const valeur = valeurs[reglage.cle];
    switch (reglage.type) {
      case 'input': {
        const membre = api.inputs.find((i) => i.name === reglage.cle);
        if (reglage.liaison) {
          const { champ, evenement } = reglage.liaison;
          attributs.push(
            evenement
              ? `[${reglage.cle}]="${champ}()" (${evenement})="${champ}.set($event)"`
              : `[(${reglage.cle})]="${champ}"`,
          );
          membres.push([`readonly ${champ} = signal(${chaine(String(valeur ?? ''))});`]);
          if (!importsCore.includes('signal')) importsCore.push('signal');
        } else if (typeof valeur === 'boolean') {
          if (valeur !== (membre ? (defautInput(membre) ?? false) : false)) {
            attributs.push(valeur ? reglage.cle : `[${reglage.cle}]="false"`);
          }
        } else if (valeur && membre && valeur !== defautInput(membre)) {
          attributs.push(`${reglage.cle}="${echapperAttribut(valeur)}"`);
        }
        if (valeur === true && reglage.codeSiActif) {
          attributs.push(...(reglage.codeSiActif.attributs ?? []));
          membres.push(...(reglage.codeSiActif.membres ?? []).map((m) => [m]));
        }
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
  // Au-delà de trois attributs, un attribut par ligne, comme le ferait Prettier.
  const ouverture =
    attributs.length > 3
      ? [`<${element}`, ...attributs.map((a) => `  ${a}`), '>']
      : [`<${[element, ...attributs].join(' ')}>`];
  // Sans contenu : balise auto-fermante pour un composant (`<soc-select … />`), fermeture explicite pour un élément natif.
  const derniere = ouverture[ouverture.length - 1];
  const fermeture = element.includes('-')
    ? derniere === '>' ? '/>' : `${derniere.slice(0, -1)} />`
    : `${derniere}</${element}>`;
  const gabarit = corps.length
    ? [...ouverture, ...corps.map((l) => `  ${l}`), `</${element}>`]
    : [...ouverture.slice(0, -1), fermeture];

  const parSource = new Map<string, string[]>();
  for (const { nom, depuis } of imports) {
    const noms = parSource.get(depuis) ?? [];
    if (!noms.includes(nom)) parSource.set(depuis, [...noms, nom]);
  }
  const lignesImport = [...parSource].map(([depuis, noms]) => `import { ${noms.join(', ')} } from '${depuis}';`);
  // Les types (SelectOption…) ne vont pas dans `imports` du composant.
  const types = new Set((fiche.donnees ?? []).map((d) => d.type));
  const nomsImportes = [...parSource.values()].flat().filter((n) => !types.has(n));

  const classe = membres.length
    ? ['export class ExempleComponent {', ...membres.flatMap((m, i) => [...(i ? [''] : []), ...m.map((l) => `  ${l}`)]), '}']
    : ['export class ExempleComponent {}'];

  return [
    `import { ${importsCore.join(', ')} } from '@angular/core';`,
    ...lignesImport,
    '',
    '@Component({',
    `  selector: 'app-exemple',`,
    `  imports: [${nomsImportes.join(', ')}],`,
    '  template: `',
    ...gabarit.map((l) => `    ${l}`),
    '  `,',
    '})',
    ...classe,
    '',
  ].join('\n');
}
