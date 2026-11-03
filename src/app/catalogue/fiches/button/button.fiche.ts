import { FicheComposant } from '../../fiche.model';

export const BUTTON: FicheComposant = {
  id: 'button',
  composant: 'SocButton',
  titre: 'Button',
  categorie: 'Actions',
  statut: 'stable',
  description:
    "Bouton d'action posé sur un vrai <button> : les attributs et événements natifs (type, disabled, click, aria-label) s'utilisent tels quels.",
  attributs: ['type="button"'],
  reglages: [
    { cle: 'variant', type: 'input', controle: 'select' },
    { cle: 'size', type: 'input', controle: 'select' },
    { cle: 'label', type: 'contenu', controle: 'texte', libelle: 'Libellé', defaut: 'Enregistrer' },
    { cle: 'disabled', type: 'natif', controle: 'interrupteur', libelle: 'Désactivé', defaut: false },
    {
      cle: 'iconeGauche',
      type: 'slot',
      controle: 'interrupteur',
      libelle: 'Icône à gauche',
      defaut: false,
      slot: '[socButtonLeftIcon]',
      position: 'avant',
      code: '<svg lucidePlus socButtonLeftIcon class="size-full" [strokeWidth]="1.5"></svg>',
      imports: [
        { nom: 'SocButtonLeftIcon', depuis: '@socium-design/angular-components' },
        { nom: 'LucidePlus', depuis: '@lucide/angular' },
      ],
    },
    {
      cle: 'iconeDroite',
      type: 'slot',
      controle: 'interrupteur',
      libelle: 'Icône à droite',
      defaut: false,
      slot: '[socButtonRightIcon]',
      position: 'apres',
      code: '<svg lucideArrowRight socButtonRightIcon class="size-full" [strokeWidth]="1.5"></svg>',
      imports: [
        { nom: 'SocButtonRightIcon', depuis: '@socium-design/angular-components' },
        { nom: 'LucideArrowRight', depuis: '@lucide/angular' },
      ],
    },
  ],
  variantes: { reglage: 'variant' },
  etats: [
    { id: 'defaut', titre: 'Par défaut', valeurs: {} },
    { id: 'desactive', titre: 'Désactivé', valeurs: { disabled: true } },
    { id: 'icone-gauche', titre: 'Icône à gauche', valeurs: { iconeGauche: true } },
    { id: 'icone-droite', titre: 'Icône à droite', valeurs: { iconeDroite: true } },
  ],
};
