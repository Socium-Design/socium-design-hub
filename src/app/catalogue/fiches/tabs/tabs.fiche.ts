import { FicheComposant } from '../../fiche.model';

export const TABS: FicheComposant = {
  id: 'tabs',
  composant: 'SocTabs',
  titre: 'Tabs',
  categorie: 'Navigation',
  statut: 'stable',
  description:
    "Onglets pour passer d'une vue à l'autre dans une même page. L'onglet actif est piloté par la page (value + change).",
  donnees: [
    {
      input: 'items',
      type: 'TabItem',
      valeur: [
        { id: 'apercu', label: 'Aperçu' },
        { id: 'historique', label: 'Historique' },
        { id: 'documents', label: 'Documents' },
        { id: 'archives', label: 'Archives', disabled: true },
      ],
    },
  ],
  reglages: [
    { cle: 'variant', type: 'input', controle: 'select', libelle: 'Variante' },
    {
      cle: 'value',
      type: 'input',
      controle: 'select',
      libelle: 'Onglet actif',
      defaut: 'apercu',
      liaison: { champ: 'onglet', evenement: 'change' },
    },
  ],
  slots: {},
  variantes: { reglage: 'variant' },
  etats: [
    { id: 'defaut', titre: 'Par défaut (« Archives » désactivé)', valeurs: {} },
    { id: 'autre-onglet', titre: 'Autre onglet actif', valeurs: { value: 'historique' } },
  ],
};
