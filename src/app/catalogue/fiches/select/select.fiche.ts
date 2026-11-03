import { FicheComposant } from '../../fiche.model';

export const SELECT: FicheComposant = {
  id: 'select',
  composant: 'SocSelect',
  titre: 'Select',
  categorie: 'Sélection',
  statut: 'stable',
  description:
    "Choix d'une valeur dans une liste déroulante. Champ de formulaire : formControl, formControlName et ngModel fonctionnent.",
  apercu: 'champ',
  donnees: [
    {
      input: 'options',
      type: 'SelectOption',
      valeur: [
        { value: 'cdi', label: 'CDI' },
        { value: 'cdd', label: 'CDD' },
        { value: 'stage', label: 'Stage' },
        { value: 'alternance', label: 'Alternance' },
      ],
    },
  ],
  reglages: [
    { cle: 'mode', type: 'input', controle: 'select', libelle: 'Mode' },
    { cle: 'label', type: 'input', controle: 'texte', libelle: 'Libellé', defaut: 'Type de contrat' },
    // Le texte par défaut du kit est en anglais (« Select an option ») : toujours passé en français.
    { cle: 'placeholder', type: 'input', controle: 'texte', libelle: 'Texte indicatif', defaut: 'Choisir un type' },
    { cle: 'helperText', type: 'input', controle: 'texte', libelle: "Texte d'aide" },
    { cle: 'value', type: 'input', controle: 'select', libelle: 'Valeur', defaut: '', liaison: { champ: 'contrat' } },
    { cle: 'disabled', type: 'input', controle: 'interrupteur', libelle: 'Désactivé' },
    { cle: 'required', type: 'input', controle: 'interrupteur', libelle: 'Obligatoire' },
    { cle: 'error', type: 'input', controle: 'interrupteur', libelle: 'Erreur' },
    { cle: 'warning', type: 'input', controle: 'interrupteur', libelle: 'Avertissement' },
  ],
  slots: {},
  variantes: { reglage: 'mode' },
  etats: [
    { id: 'defaut', titre: 'Par défaut', valeurs: {} },
    { id: 'desactive', titre: 'Désactivé', valeurs: { disabled: true } },
    { id: 'erreur', titre: 'Erreur', valeurs: { error: true, helperText: 'Choisissez un type de contrat.' } },
    { id: 'avertissement', titre: 'Avertissement', valeurs: { warning: true, helperText: 'Contrat bientôt échu.' } },
    { id: 'aide', titre: "Avec texte d'aide", valeurs: { helperText: 'Contrat principal du collaborateur.' } },
    { id: 'obligatoire', titre: 'Obligatoire', valeurs: { required: true } },
    { id: 'valeur', titre: 'Avec valeur', valeurs: { value: 'cdi' } },
  ],
};
