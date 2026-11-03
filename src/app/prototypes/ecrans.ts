import { ProduitId } from './produits';

/** Site où sont déployés les prototypes (dépôt sirh_prototype). Seul endroit où cette adresse est écrite. */
export const PROTOTYPES_URL = 'https://sirh-prototype.vercel.app';

export type StatutEcran = 'en-cours' | 'valide' | 'en-dev';

/** Fiche d'un écran prototypé : il s'affiche dans le hub, chargé depuis PROTOTYPES_URL + route. */
export interface FicheEcran {
  /** Identifiant dans l'URL du hub : /prototypes/<produit>/<id>. */
  id: string;
  produit: ProduitId;
  titre: string;
  /** Route de l'écran dans sirh_prototype. */
  route: string;
  statut: StatutEcran;
  /** Épique Notion (seul lien externe autorisé) ; absent si inconnu. */
  epique?: string;
}

const EPIQUES = {
  options: 'https://app.notion.com/p/40715b630f92811ab963f4d3931a9a53',
  tableauxDeBord: 'https://app.notion.com/p/3ce15b630f9280ac80b7d8d5145670a9',
  populations: 'https://app.notion.com/p/3db15b630f928082b342c2a6b39f463c',
  objectifs: 'https://app.notion.com/p/40c15b630f9281ebb56bd7288befc462',
  notesEvaluation: 'https://app.notion.com/p/40015b630f928170ba2bdb9e6cb4c04c',
};

export const ECRANS: FicheEcran[] = [
  { id: 'employes', produit: 'workspace', titre: 'Employés', route: '/workspace/employes', statut: 'en-cours' },
  {
    id: 'entreprises',
    produit: 'workspace',
    titre: 'Entreprises',
    route: '/workspace/entreprises',
    statut: 'en-cours',
    epique: EPIQUES.options,
  },
  {
    id: 'options-entreprise',
    produit: 'workspace',
    titre: 'Fonctionnalités et options',
    route: '/workspace/entreprises/ent-1/options',
    statut: 'en-cours',
    epique: EPIQUES.options,
  },
  {
    id: 'tableau-de-bord',
    produit: 'workspace',
    titre: 'Tableau de bord',
    route: '/workspace/tableau-de-bord',
    statut: 'en-cours',
    epique: EPIQUES.tableauxDeBord,
  },
  {
    id: 'populations',
    produit: 'workspace',
    titre: 'Populations',
    route: '/workspace/configuration/populations',
    statut: 'en-dev',
    epique: EPIQUES.populations,
  },
  {
    id: 'population-detail',
    produit: 'workspace',
    titre: 'Population (détail)',
    route: '/workspace/configuration/populations/pop-1',
    statut: 'en-dev',
    epique: EPIQUES.populations,
  },
  {
    id: 'tableaux-de-bord',
    produit: 'workspace',
    titre: 'Gestion des tableaux de bord',
    route: '/workspace/configuration/tableaux-de-bord',
    statut: 'en-cours',
    epique: EPIQUES.tableauxDeBord,
  },
  {
    id: 'composition-tableau-de-bord',
    produit: 'workspace',
    titre: "Composition d'un tableau de bord",
    route: '/workspace/configuration/tableaux-de-bord/tdb-1',
    statut: 'en-cours',
    epique: EPIQUES.tableauxDeBord,
  },
  {
    id: 'objectifs',
    produit: 'performance',
    titre: 'Objectifs (liste)',
    route: '/perf/objectifs',
    statut: 'en-cours',
    epique: EPIQUES.objectifs,
  },
  {
    id: 'objectifs-creation',
    produit: 'performance',
    titre: "Création d'un objectif",
    route: '/perf/objectifs/nouveau',
    statut: 'en-cours',
    epique: EPIQUES.objectifs,
  },
  {
    id: 'objectif-detail',
    produit: 'performance',
    titre: 'Objectif (détail)',
    route: '/perf/objectifs/obj-1',
    statut: 'en-cours',
    epique: EPIQUES.objectifs,
  },
  {
    id: 'objectif-modification',
    produit: 'performance',
    titre: "Modification d'un objectif",
    route: '/perf/objectifs/obj-1/modifier',
    statut: 'en-cours',
    epique: EPIQUES.objectifs,
  },
  {
    id: 'notes-evaluation',
    produit: 'performance',
    titre: "Notes d'évaluation",
    route: '/perf/configurations/notes-evaluation',
    statut: 'en-cours',
    epique: EPIQUES.notesEvaluation,
  },
];

export const STATUTS_ECRAN: Record<StatutEcran, { libelle: string; couleur: 'orange' | 'success' | 'information' }> = {
  'en-cours': { libelle: 'En cours', couleur: 'orange' },
  valide: { libelle: 'Validé', couleur: 'success' },
  'en-dev': { libelle: 'En dev', couleur: 'information' },
};

export function ecransDuProduit(produit: string): FicheEcran[] {
  return ECRANS.filter((e) => e.produit === produit);
}

export function ecran(produit: string, id: string): FicheEcran | undefined {
  return ECRANS.find((e) => e.produit === produit && e.id === id);
}

export function urlPrototype(fiche: FicheEcran): string {
  return `${PROTOTYPES_URL}${fiche.route}`;
}
