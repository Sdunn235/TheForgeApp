import Entry from '@/models/Entry.js';

/**
 * A spell the character carries. Adds a level and a mana cost to Entry, and
 * knows how both read on screen (these were spellLevelLabel and
 * spellCostLabel in the old helpers/labels.js).
 */
export default class Spell extends Entry {
    /**
     * @param {Object} [source={}] A catalog spell, or a saved one.
     */
    constructor(source = {}) {
        super(source);
        this.level = source.level ?? 0;
        this.cost = source.cost ?? 0;
    }

    /**
     * Level 0 is a cantrip, which is not "Level 0" to anyone who plays.
     *
     * @returns {string} "Cantrip" or "Level 3".
     */
    get levelLabel() {
        return this.level === 0 ? 'Cantrip' : 'Level ' + this.level;
    }

    /**
     * @returns {string} "25 Mana".
     */
    get costLabel() {
        return this.cost + ' Mana';
    }
}
