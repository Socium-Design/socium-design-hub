import { AppIconName } from '@socium-design/angular-components';

export type ProduitId = 'workspace' | 'performance' | 'payroll' | 'workflow' | 'doc' | 'job' | 'time';

/** Fiche d'un produit du SIRH : carte de l'accueil Prototypes et entrée du menu latéral. */
export interface FicheProduit {
  id: ProduitId;
  nom: string;
  description: string;
  /** Glyphe du produit dans le kit (celui de l'AppSwitch). */
  icone: AppIconName;
  /** Fichier de public/illustrations ; absent → fond neutre. */
  illustration?: string;
}

export const PRODUITS: FicheProduit[] = [
  {
    id: 'workspace',
    nom: 'Workspace',
    description: "Le socle : entreprises, employés, organisation et tableaux de bord.",
    icone: 'workspace',
    // Pas d'illustration fournie pour Workspace : fond neutre.
  },
  {
    id: 'performance',
    nom: 'Performance',
    description: 'Objectifs, campagnes et évaluations des collaborateurs.',
    icone: 'performance',
    illustration: 'performance.svg',
  },
  {
    id: 'payroll',
    nom: 'Payroll',
    description: 'Préparation et contrôle de la paie.',
    icone: 'payroll',
    illustration: 'payroll.svg',
  },
  {
    id: 'workflow',
    nom: 'Workflow',
    description: 'Demandes et circuits de validation.',
    icone: 'workflow',
    illustration: 'workflow.svg',
  },
  {
    id: 'doc',
    nom: 'Doc',
    description: 'Documents RH, modèles et signatures.',
    icone: 'doc',
    illustration: 'doc.svg',
  },
  {
    id: 'job',
    nom: 'Job',
    description: 'Recrutement : offres, candidatures et suivi.',
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
