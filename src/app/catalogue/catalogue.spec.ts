import { composantApi, typeApi } from './api-kit';
import { CATALOGUE, parCategorie } from './catalogue';
import { optionsReglage } from './reglages';

// Garde-fou : à chaque mise à jour du kit, une fiche qui cite un input, un slot ou une valeur disparus fait échouer les tests.
describe('Catalogue : fiches cohérentes avec l’API du kit', () => {
  for (const { fiche } of CATALOGUE) {
    describe(fiche.id, () => {
      const api = composantApi(fiche.composant);

      it('cite un composant qui existe dans le kit', () => {
        expect(api).withContext(fiche.composant).toBeDefined();
      });

      it('ne règle que des inputs et des slots existants', () => {
        for (const reglage of fiche.reglages) {
          if (reglage.type === 'input') {
            expect(api?.inputs.some((i) => i.name === reglage.cle)).withContext(reglage.cle).toBeTrue();
            if (reglage.controle === 'select') {
              expect(optionsReglage(fiche, reglage).length).withContext(reglage.cle).toBeGreaterThan(0);
            }
            const evenement = reglage.liaison?.evenement;
            if (evenement) expect(api?.outputs.some((o) => o.name === evenement)).withContext(evenement).toBeTrue();
            if (reglage.liaison && !evenement) {
              expect(api?.inputs.find((i) => i.name === reglage.cle)?.twoWay).withContext(reglage.cle).toBeTrue();
            }
          }
          if (reglage.type === 'slot') {
            expect(api?.slots.some((s) => s.selector === reglage.slot)).withContext(reglage.slot).toBeTrue();
          }
        }
      });

      it('ne passe de données qu’à des inputs existants, avec un type exporté par le kit', () => {
        for (const donnee of fiche.donnees ?? []) {
          expect(api?.inputs.find((i) => i.name === donnee.input)?.type).withContext(donnee.input).toBe(`${donnee.type}[]`);
          expect(typeApi(donnee.type)).withContext(donnee.type).toBeDefined();
        }
      });

      it('donne un rôle en français à chaque slot du kit, et seulement à eux', () => {
        expect(Object.keys(fiche.slots).sort()).toEqual((api?.slots.map((s) => s.selector) ?? []).sort());
      });

      it('ne cite dans les variantes et les états que ses propres réglages', () => {
        const cles = fiche.reglages.map((r) => r.cle);
        if (fiche.variantes) expect(cles).toContain(fiche.variantes.reglage);
        for (const etat of fiche.etats) expect(cles).toEqual(jasmine.arrayContaining(Object.keys(etat.valeurs)));
      });
    });
  }

  it('groupe les fiches par catégorie', () => {
    expect(parCategorie().map((g) => [g.categorie, g.fiches.map((f) => f.id)])).toEqual([
      ['Actions', ['button']],
      ['Saisie', ['champ-texte']],
      ['Sélection', ['select']],
      ['Navigation', ['tabs']],
      ['Feedback', ['tag']],
    ]);
  });
});
