import { Type } from '@angular/core';

export type Statut = 'stable' | 'beta' | 'labs' | 'deprecated';

/** Valeurs courantes des réglages d'un exemple, par clé de réglage. */
export type Valeurs = Record<string, string | boolean>;

export interface ImportCode {
  nom: string;
  depuis: string;
}

/** Input du composant (nom = `cle`) : options lues dans le type du kit, défaut lu dans l'API. */
export interface ReglageInput {
  cle: string;
  type: 'input';
  controle: 'select';
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
  /** Une ligne par valeur de ce réglage dans la section « Variantes ». */
  variantes: { reglage: string };
  etats: Exemple[];
}

/** Entrée du catalogue : la fiche et le gabarit d'aperçu, chargé seulement dans l'iframe. */
export interface EntreeCatalogue {
  fiche: FicheComposant;
  apercu: () => Promise<Type<unknown>>;
}
