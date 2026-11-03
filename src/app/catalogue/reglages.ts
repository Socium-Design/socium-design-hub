import { composantApi, defautInput, valeursType } from './api-kit';
import { FicheComposant, Reglage, Valeurs } from './fiche.model';

/**
 * Options d'un réglage `select` : valeurs du type union de l'input dans le kit, ou à défaut identifiants (`id` /
 * `value`) de la donnée fixe de la fiche (ex. l'onglet actif parmi les `items` des tabs).
 */
export function optionsReglage(fiche: FicheComposant, reglage: Reglage): string[] {
  if (reglage.type !== 'input' || reglage.controle !== 'select') return [];
  const membre = composantApi(fiche.composant)?.inputs.find((i) => i.name === reglage.cle);
  const union = membre ? valeursType(membre.type) : [];
  if (union.length) return union;
  const elements = fiche.donnees?.flatMap((d) => d.valeur) ?? [];
  return elements.map((e) => String(e['id'] ?? e['value'] ?? '')).filter(Boolean);
}

export function defautReglage(fiche: FicheComposant, reglage: Reglage): string | boolean {
  if (reglage.type !== 'input') return reglage.defaut;
  if (reglage.defaut !== undefined) return reglage.defaut;
  const membre = composantApi(fiche.composant)?.inputs.find((i) => i.name === reglage.cle);
  const api = membre && defautInput(membre);
  if (api !== undefined) return api;
  if (reglage.controle === 'interrupteur') return false;
  return reglage.controle === 'select' ? (optionsReglage(fiche, reglage)[0] ?? '') : '';
}

export function valeursParDefaut(fiche: FicheComposant): Valeurs {
  return Object.fromEntries(fiche.reglages.map((r) => [r.cle, defautReglage(fiche, r)]));
}

/** Un exemple par valeur du réglage des variantes, les autres réglages à leur défaut. */
export function exemplesVariantes(fiche: FicheComposant) {
  const reglage = fiche.reglages.find((r) => r.cle === fiche.variantes?.reglage);
  if (!reglage) return [];
  return optionsReglage(fiche, reglage).map((valeur) => ({
    id: valeur,
    titre: valeur,
    valeurs: { ...valeursParDefaut(fiche), [reglage.cle]: valeur },
  }));
}

export function exemplesEtats(fiche: FicheComposant) {
  return fiche.etats.map((e) => ({ ...e, valeurs: { ...valeursParDefaut(fiche), ...e.valeurs } }));
}
