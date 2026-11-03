import KIT_API from '../generated/kit-api.json';

/** Forme de `docs/generated/components.json` du kit (extraite par scripts/extraire-api-kit.mjs). */
export interface ApiMembre {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  twoWay: boolean;
  doc: string;
}

export interface ApiSlot {
  selector: string;
  description: string;
}

export interface ApiComposant {
  name: string;
  selector: string;
  level: string;
  entryPoint: string;
  experimental: boolean;
  file: string;
  description: string;
  formControl: boolean;
  inputs: ApiMembre[];
  outputs: ApiMembre[];
  slots: ApiSlot[];
}

export interface ApiType {
  name: string;
  file: string;
  doc: string;
  text: string;
}

interface ApiKit {
  package: string;
  version: string;
  depot: string;
  dossier: string;
  components: ApiComposant[];
  types: ApiType[];
}

const API = KIT_API as ApiKit;

export const KIT_PAQUET = API.package;
export const KIT_VERSION = API.version;

export function composantApi(nom: string): ApiComposant | undefined {
  return API.components.find((c) => c.name === nom);
}

export function typeApi(nom: string): ApiType | undefined {
  return API.types.find((t) => t.name === nom);
}

/** Valeurs d'un type union de chaînes (`'a' | 'b'`), lues dans le texte du type exporté par le kit. */
export function valeursType(nom: string): string[] {
  const texte = typeApi(nom)?.text ?? '';
  const union = texte.slice(texte.indexOf('=') + 1);
  return [...union.matchAll(/'([^']*)'/g)].map((m) => m[1]);
}

/** Valeur par défaut d'un input telle que l'écrit le kit (`'primary'`), sans les guillemets. */
export function defautInput(membre: ApiMembre): string | boolean | undefined {
  const brut = membre.default;
  if (brut === undefined) return undefined;
  if (brut === 'true' || brut === 'false') return brut === 'true';
  const chaine = /^(['"])(.*)\1$/.exec(brut);
  return chaine ? chaine[2] : brut;
}

/** Lien vers le fichier source, figé sur le tag de la version installée. */
export function lienSource(api: ApiComposant): string {
  const chemin = api.file.startsWith('labs/') ? `labs/src/${api.file.slice('labs/'.length)}` : `src/${api.file}`;
  return `${API.depot}/blob/v${API.version}/${API.dossier}/${chemin}`;
}

/** Types du kit cités par les inputs et outputs d'un composant (pour la section API). */
export function typesCites(api: ApiComposant): ApiType[] {
  const noms = new Set([...api.inputs, ...api.outputs].flatMap((m) => m.type.match(/[A-Z]\w+/g) ?? []));
  return API.types.filter((t) => noms.has(t.name));
}
