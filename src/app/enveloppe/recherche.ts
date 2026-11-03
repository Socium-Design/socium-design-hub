import { composantApi } from '../catalogue/api-kit';
import { FicheComposant } from '../catalogue/fiche.model';

/** Fiches dont le titre, le nom de classe ou le sélecteur contient la requête (sans casse ni accents). */
export function rechercher(fiches: FicheComposant[], requete: string): FicheComposant[] {
  const normaliser = (t: string) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const q = normaliser(requete.trim());
  if (!q) return [];
  return fiches.filter((f) =>
    [f.titre, f.composant, composantApi(f.composant)?.selector ?? ''].some((champ) => normaliser(champ).includes(q)),
  );
}
