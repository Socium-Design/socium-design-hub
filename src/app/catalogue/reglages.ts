import { composantApi, defautInput, valeursType } from './api-kit';
import { FicheComposant, Reglage, Valeurs } from './fiche.model';

/** Options d'un réglage `select`, lues dans le type de l'input du kit. */
export function optionsReglage(fiche: FicheComposant, reglage: Reglage): string[] {
  const membre = composantApi(fiche.composant)?.inputs.find((i) => i.name === reglage.cle);
  return membre ? valeursType(membre.type) : [];
}

export function defautReglage(fiche: FicheComposant, reglage: Reglage): string | boolean {
  if (reglage.type !== 'input') return reglage.defaut;
  const membre = composantApi(fiche.composant)?.inputs.find((i) => i.name === reglage.cle);
  return (membre && defautInput(membre)) ?? optionsReglage(fiche, reglage)[0] ?? '';
}

export function valeursParDefaut(fiche: FicheComposant): Valeurs {
  return Object.fromEntries(fiche.reglages.map((r) => [r.cle, defautReglage(fiche, r)]));
}

/** Un exemple par valeur du réglage des variantes, les autres réglages à leur défaut. */
export function exemplesVariantes(fiche: FicheComposant) {
  const reglage = fiche.reglages.find((r) => r.cle === fiche.variantes.reglage);
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
