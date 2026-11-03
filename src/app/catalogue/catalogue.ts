import { EntreeCatalogue, FicheComposant } from './fiche.model';
import { BUTTON } from './fiches/button/button.fiche';
import { CHAMP_TEXTE } from './fiches/champ-texte/champ-texte.fiche';
import { SELECT } from './fiches/select/select.fiche';
import { TABS } from './fiches/tabs/tabs.fiche';
import { TAG } from './fiches/tag/tag.fiche';

/** Toutes les fiches du hub, une ligne par composant. La barre latérale et la recherche en sont tirées. */
export const CATALOGUE: EntreeCatalogue[] = [
  { fiche: BUTTON, apercu: () => import('./fiches/button/button.apercu').then((m) => m.ButtonApercuComponent) },
  {
    fiche: CHAMP_TEXTE,
    apercu: () => import('./fiches/champ-texte/champ-texte.apercu').then((m) => m.ChampTexteApercuComponent),
  },
  { fiche: SELECT, apercu: () => import('./fiches/select/select.apercu').then((m) => m.SelectApercuComponent) },
  { fiche: TABS, apercu: () => import('./fiches/tabs/tabs.apercu').then((m) => m.TabsApercuComponent) },
  { fiche: TAG, apercu: () => import('./fiches/tag/tag.apercu').then((m) => m.TagApercuComponent) },
];

export function entree(id: string): EntreeCatalogue | undefined {
  return CATALOGUE.find((e) => e.fiche.id === id);
}

/** Fiches groupées par catégorie, dans l'ordre d'apparition, triées par titre dans chaque catégorie. */
export function parCategorie(fiches: FicheComposant[] = CATALOGUE.map((e) => e.fiche)) {
  const groupes = new Map<string, FicheComposant[]>();
  for (const fiche of fiches) groupes.set(fiche.categorie, [...(groupes.get(fiche.categorie) ?? []), fiche]);
  return [...groupes].map(([categorie, liste]) => ({
    categorie,
    fiches: liste.sort((a, b) => a.titre.localeCompare(b.titre, 'fr')),
  }));
}
