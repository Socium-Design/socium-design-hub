import { FicheComposant } from '../../fiche.model';

export const TAG: FicheComposant = {
  id: 'tag',
  composant: 'SocTag',
  titre: 'Tag',
  categorie: 'Feedback',
  statut: 'stable',
  description: "Étiquette colorée qui qualifie un élément (statut, catégorie). Peut être supprimable.",
  reglages: [
    { cle: 'color', type: 'input', controle: 'select', libelle: 'Couleur' },
    { cle: 'size', type: 'input', controle: 'select', libelle: 'Taille' },
    { cle: 'label', type: 'contenu', controle: 'texte', libelle: 'Texte', defaut: 'Validé' },
    {
      cle: 'removable',
      type: 'input',
      controle: 'interrupteur',
      libelle: 'Supprimable',
      codeSiActif: { attributs: ['(remove)="retirer()"'], membres: ['retirer(): void {}'] },
    },
  ],
  slots: { default: 'Texte du tag' },
  variantes: { reglage: 'color' },
  etats: [
    { id: 'defaut', titre: 'Par défaut', valeurs: {} },
    { id: 'supprimable', titre: 'Supprimable', valeurs: { removable: true } },
    { id: 'grand', titre: 'Grande taille', valeurs: { size: 'lg' } },
  ],
};
