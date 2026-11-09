import Collection from '@/models/Collection.js';
import Feat from '@/models/Feat.js';

/**
 * The feats a character holds. A Collection, plus the rule for which slot
 * a new feat fills: level-earned slots fill first, then bonus slots.
 */
export default class FeatList extends Collection {
    /**
     * @param {Object[]} [saved=[]] Saved feats, rebuilt as Feat objects.
     */
    constructor(saved = []) {
        super(saved.map((feat) => new Feat(feat)));
    }

    /**
     * @returns {number} How many feats sit in a level-earned slot.
     */
    get earnedCount() {
        return this.filter((feat) => feat.isEarned).length;
    }

    /**
     * Add a feat from the catalog. It is "earned" while the levels still
     * cover it and "bonus" after. Was addFeat in the forge.
     *
     * @param {Object} catalogFeat An entry from data/feats.js featCatalog.
     * @param {number} earnedSlots How many slots the character's levels pay for.
     * @returns {Feat} The new feat.
     */
    addFeat(catalogFeat, earnedSlots) {
        const slot = this.earnedCount < earnedSlots ? 'earned' : 'bonus';

        return this.add(new Feat(catalogFeat, slot));
    }
}
