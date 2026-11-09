import Entry from '@/models/Entry.js';

/**
 * A feat the character holds. Adds its kind (points or special) and where
 * its slot came from (earned by levels, or a bonus) to Entry.
 */
export default class Feat extends Entry {
    /**
     * @param {Object} [source={}]  A catalog feat, or a saved one.
     * @param {string} [slotSource] 'earned' or 'bonus' (data/feats.js featSources).
     *                              Left out: the saved one, or 'earned'.
     */
    constructor(source = {}, slotSource = source.source ?? 'earned') {
        super(source);
        this.kind = source.kind || '';
        this.source = slotSource;
    }

    /**
     * @returns {boolean} true if the levels paid for this feat's slot.
     */
    get isEarned() {
        return this.source === 'earned';
    }
}
