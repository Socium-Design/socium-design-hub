import { composantApi } from './api-kit';
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
            expect(optionsReglage(fiche, reglage).length).withContext(reglage.cle).toBeGreaterThan(0);
          }
          if (reglage.type === 'slot') {
            expect(api?.slots.some((s) => s.selector === reglage.slot)).withContext(reglage.slot).toBeTrue();
          }
        }
      });

      it('ne cite dans les variantes et les états que ses propres réglages', () => {
        const cles = fiche.reglages.map((r) => r.cle);
        expect(cles).toContain(fiche.variantes.reglage);
        for (const etat of fiche.etats) expect(cles).toEqual(jasmine.arrayContaining(Object.keys(etat.valeurs)));
      });
    });
  }

  it('groupe les fiches par catégorie', () => {
    expect(parCategorie()).toEqual([{ categorie: 'Actions', fiches: [jasmine.objectContaining({ id: 'button' })] }]);
  });
});
