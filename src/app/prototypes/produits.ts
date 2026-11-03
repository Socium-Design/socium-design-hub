import { AppIconName } from '@socium-design/angular-components';

export type ProduitId = 'workspace' | 'performance' | 'payroll' | 'workflow' | 'doc' | 'job' | 'time';

/** Fiche d'un produit du SIRH : carte de l'accueil Prototypes et entrée du menu latéral. */
export interface FicheProduit {
  id: ProduitId;
  nom: string;
  description: string;
  /** Glyphe du produit dans le kit (celui de l'AppSwitch). */
  icone: AppIconName;
  /** Fichier de public/illustrations ; absent → dégradé bleu clair avec le glyphe en grand. */
  illustration?: string;
}

export const PRODUITS: FicheProduit[] = [
  {
    id: 'workspace',
    nom: 'Workspace',
    description: "Le socle : entreprises, employés, organisation et tableaux de bord.",
    icone: 'workspace',
    // Pas d'illustration fournie pour Workspace : dégradé et glyphe en grand.
  },
  {
    id: 'performance',
    nom: 'Performance',
    description: 'Pilotez les performances et suivez les évaluations de vos équipes.',
    icone: 'performance',
    illustration: 'performance.svg',
  },
  {
    id: 'payroll',
    nom: 'Payroll',
    description: "Gérez la paie en toute sérénité, de l'édition au versement.",
    icone: 'payroll',
    illustration: 'payroll.svg',
  },
  {
    id: 'workflow',
    nom: 'Workflow',
    description: 'Automatisez et suivez facilement les processus administratifs.',
    icone: 'workflow',
    illustration: 'workflow.svg',
  },
  {
    id: 'doc',
    nom: 'Doc',
    description: 'Classez, partagez et sécurisez tous les documents RH.',
    icone: 'doc',
    illustration: 'doc.svg',
  },
  {
    id: 'job',
    nom: 'Job',
    description: 'Simplifiez et accélérez vos recrutements du début à la fin.',
    icone: 'job',
    illustration: 'job.svg',
  },
  {
    id: 'time',
    nom: 'Time',
    description: 'Temps de travail, absences et congés.',
    icone: 'time',
    illustration: 'time.svg',
  },
];

export function produit(id: string): FicheProduit | undefined {
  return PRODUITS.find((p) => p.id === id);
}
