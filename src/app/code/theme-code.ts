/**
 * Thème des blocs de code : VS Code Dark+ (Shiki). C'est la seule exception aux tokens du kit, et elle est définie
 * ici seulement. Couleurs de l'interface du bloc reprises de Dark+ ; deux couleurs de Dark+ passent sous 4,5:1 sur
 * le fond et sont éclaircies (contraste mesuré : chaque couleur de texte ≥ 4,5:1 sur #1E1E1E).
 */
export const THEME_CODE = {
  shiki: 'dark-plus',
  fond: '#1E1E1E',
  texte: '#D4D4D4', // 11,3:1
  enteteFond: '#252526',
  enteteTexte: '#CCCCCC', // 9,5:1 sur l'en-tête
  bordure: '#3C3C3C',
  /** Remplacements appliqués au thème Dark+ chargé : couleur d'origine → couleur conforme. */
  remplacements: {
    '#808080': '#888888', // ponctuation des balises HTML (< > </) : 4,2 → 4,7:1
    '#646695': '#8486B5', // constantes d'expression régulière : 3,1 → 4,8:1
    '#000080': '#D4D4D4', // titres Markdown (bleu marine illisible sur fond sombre)
  } as Record<string, string>,
} as const;

export type LangageCode = 'angular-ts' | 'typescript' | 'json' | 'shellscript' | 'ini';
