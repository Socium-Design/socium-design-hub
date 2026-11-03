import { Type } from '@angular/core';

export type Statut = 'stable' | 'beta' | 'labs' | 'deprecated';

/** Valeurs courantes des réglages d'un exemple, par clé de réglage. */
export type Valeurs = Record<string, string | boolean>;

export interface ImportCode {
  nom: string;
  depuis: string;
}

/**
 * Input du composant (nom = `cle`). Liste : options lues dans le type union du kit, ou à défaut dans les identifiants
 * de la donnée fixe (`id` / `value`). Défaut : `defaut`, sinon celui de l'API.
 */
export interface ReglageInput {
  cle: string;
  type: 'input';
  controle: 'select' | 'texte' | 'interrupteur';
  libelle: string;
  defaut?: string | boolean;
  /**
   * Liée à un signal de la classe dans le code généré : `[(cle)]="champ"`, ou avec `evenement`
   * `[cle]="champ()" (evenement)="champ.set($event)"`.
   */
  liaison?: { champ: string; evenement?: string };
  /** Code ajouté quand l'interrupteur est actif : attributs sur l'élément, membres de la classe. */
  codeSiActif?: { attributs?: string[]; membres?: string[] };
}

/** Donnée passée telle quelle à un input (`options`, `items`) : propriété de la classe dans le code généré. */
export interface DonneeFixe {
  input: string;
  /** Type exporté par le kit d'un élément du tableau (`SelectOption`). */
  type: string;
  valeur: Record<string, string | boolean>[];
}

/** Texte projeté dans le slot par défaut. */
export interface ReglageContenu {
  cle: string;
  type: 'contenu';
  controle: 'texte';
  libelle: string;
  defaut: string;
}

/** Attribut booléen natif de l'élément hôte (`disabled`…). */
export interface ReglageNatif {
  cle: string;
  type: 'natif';
  controle: 'interrupteur';
  libelle: string;
  defaut: boolean;
}

/** Élément projeté dans un slot nommé, avec le code à écrire et ses imports. */
export interface ReglageSlot {
  cle: string;
  type: 'slot';
  controle: 'interrupteur';
  libelle: string;
  defaut: boolean;
  slot: string;
  /** Place de l'élément par rapport au contenu par défaut. */
  position: 'avant' | 'apres';
  code: string;
  imports: ImportCode[];
}

export type Reglage = ReglageInput | ReglageContenu | ReglageNatif | ReglageSlot;

/** Nom technique d'un réglage, affiché en petit à côté de son libellé. */
export function nomTechnique(reglage: Reglage): string {
  switch (reglage.type) {
    case 'slot':
      return reglage.slot;
    case 'contenu':
      return 'contenu';
    default:
      return reglage.cle;
  }
}

export interface Exemple {
  id: string;
  titre: string;
  valeurs: Valeurs;
}

/** Fiche d'un composant : les pages sont générées à partir d'elle et de l'API du kit. */
export interface FicheComposant {
  id: string;
  /** Nom de la classe dans l'API du kit : sélecteur, fichier, inputs, slots et version en viennent. */
  composant: string;
  titre: string;
  categorie: string;
  statut: Statut;
  description: string;
  /** Attributs fixes écrits dans le code généré (`type="button"`). */
  attributs?: string[];
  reglages: Reglage[];
  /** Rôle court, en français, de chaque slot du kit (`default` pour le contenu par défaut). */
  slots: Record<string, string>;
  donnees?: DonneeFixe[];
  /** Une ligne par valeur de ce réglage dans la section « Variantes » ; sans elle, pas de section. */
  variantes?: { reglage: string };
  /** Largeur de chaque exemple dans l'aperçu : celle du contenu, ou celle d'un champ de formulaire. */
  apercu?: 'contenu' | 'champ';
  etats: Exemple[];
}

/** Entrée du catalogue : la fiche et le gabarit d'aperçu, chargé seulement dans l'iframe. */
export interface EntreeCatalogue {
  fiche: FicheComposant;
  apercu: () => Promise<Type<unknown>>;
}
