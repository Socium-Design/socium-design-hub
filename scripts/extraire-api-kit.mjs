// Extrait l'API du kit installé (docs/generated/components.json, généré depuis le code du kit) vers
// src/app/generated/kit-api.json. Lancé avant start, build et test : l'API affichée suit toujours le kit installé.
// Le paquet n'exporte pas ce fichier : on le lit directement dans node_modules.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const kit = join(racine, 'node_modules/@socium-design/angular-components');
const lireJson = (chemin) => JSON.parse(readFileSync(chemin, 'utf8'));

const paquet = lireJson(join(kit, 'package.json'));
const api = lireJson(join(kit, 'docs/generated/components.json'));

const sortie = {
  package: paquet.name,
  version: paquet.version,
  depot: paquet.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''),
  dossier: paquet.repository.directory,
  components: api.components,
  types: api.types,
};

const cible = join(racine, 'src/app/generated/kit-api.json');
mkdirSync(dirname(cible), { recursive: true });
writeFileSync(cible, JSON.stringify(sortie, null, 2) + '\n');
console.log(`API du kit ${sortie.package}@${sortie.version} : ${sortie.components.length} composants → src/app/generated/kit-api.json`);
