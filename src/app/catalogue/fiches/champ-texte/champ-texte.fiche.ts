import { FicheComposant } from '../../fiche.model';

export const CHAMP_TEXTE: FicheComposant = {
  id: 'champ-texte',
  composant: 'SocInputText',
  titre: 'Champ texte',
  categorie: 'Saisie',
  statut: 'stable',
  description:
    'Saisie d\'un texte sur une ligne, avec libellé, texte d\'aide et état d\'erreur. Champ de formulaire : formControl, formControlName et ngModel fonctionnent.',
  apercu: 'champ',
  reglages: [
    { cle: 'label', type: 'input', controle: 'texte', libelle: 'Libellé', defaut: 'Nom' },
    { cle: 'placeholder', type: 'input', controle: 'texte', libelle: 'Texte indicatif', defaut: 'Ex. Awa Diop' },
    { cle: 'helperText', type: 'input', controle: 'texte', libelle: "Texte d'aide" },
    { cle: 'value', type: 'input', controle: 'texte', libelle: 'Valeur', liaison: { champ: 'nom' } },
    { cle: 'disabled', type: 'input', controle: 'interrupteur', libelle: 'Désactivé' },
    { cle: 'required', type: 'input', controle: 'interrupteur', libelle: 'Obligatoire' },
    { cle: 'error', type: 'input', controle: 'interrupteur', libelle: 'Erreur' },
    { cle: 'readonly', type: 'input', controle: 'interrupteur', libelle: 'Lecture seule' },
    {
      cle: 'iconeGauche',
      type: 'slot',
      controle: 'interrupteur',
      libelle: 'Icône à gauche',
      defaut: false,
      slot: '[socInputTextLeftIcon]',
      position: 'avant',
      code: '<svg lucideUser socInputTextLeftIcon class="size-full" [strokeWidth]="1.5"></svg>',
      imports: [
        { nom: 'SocInputTextLeftIcon', depuis: '@socium-design/angular-components' },
        { nom: 'LucideUser', depuis: '@lucide/angular' },
      ],
    },
    {
      cle: 'iconeDroite',
      type: 'slot',
      controle: 'interrupteur',
      libelle: 'Icône à droite',
      defaut: false,
      slot: '[socInputTextRightIcon]',
      position: 'apres',
      code: '<svg lucideInfo socInputTextRightIcon class="size-full" [strokeWidth]="1.5"></svg>',
      imports: [
        { nom: 'SocInputTextRightIcon', depuis: '@socium-design/angular-components' },
        { nom: 'LucideInfo', depuis: '@lucide/angular' },
      ],
    },
  ],
  slots: {
    '[socInputTextLeftIcon]': 'Icône avant la saisie',
    '[socInputTextRightIcon]': 'Icône après la saisie',
  },
  etats: [
    { id: 'defaut', titre: 'Par défaut', valeurs: {} },
    { id: 'desactive', titre: 'Désactivé', valeurs: { disabled: true } },
    { id: 'erreur', titre: 'Erreur', valeurs: { error: true, helperText: 'Ce champ est obligatoire.' } },
    { id: 'aide', titre: "Avec texte d'aide", valeurs: { helperText: "Tel qu'il figure sur la pièce d'identité." } },
    { id: 'obligatoire', titre: 'Obligatoire', valeurs: { required: true } },
    { id: 'valeur', titre: 'Avec valeur', valeurs: { value: 'Awa Diop' } },
  ],
};
