import { Exemple } from '../catalogue/fiche.model';

/** Messages entre l'enveloppe et l'iframe d'aperçu (même origine, vérifiée des deux côtés). */
export type MessageApercu =
  | { canal: 'socium-hub'; type: 'pret' }
  | { canal: 'socium-hub'; type: 'hauteur'; hauteur: number }
  | { canal: 'socium-hub'; type: 'rendu'; exemples: Exemple[]; legendes: boolean };

export const CANAL = 'socium-hub';

export function estMessageApercu(donnees: unknown): donnees is MessageApercu {
  return typeof donnees === 'object' && donnees !== null && (donnees as { canal?: unknown }).canal === CANAL;
}
