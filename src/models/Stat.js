/**
 * One of the six attributes (Strength, Dexterity...). Not an Entry: it has a
 * label instead of a name and does not come from a catalog the player picks
 * from, so it does not share Entry's shape.
 */
export default class Stat {
    /**
     * @param {Object} source A stat from data/character.js startingStats, or a saved one.
     */
    constructor(source) {
        this.id = source.id;
        this.label = source.label;
        this.min = source.min;
        this.max = source.max;
        this.value = source.value;
        this.description = source.description || '';
    }

    /**
     * Stat points this attribute uses. Every point above the floor costs one,
     * so a stat sitting at its minimum is free.
     *
     * @returns {number}
     */
    get spent() {
        return this.value - this.min;
    }
}
