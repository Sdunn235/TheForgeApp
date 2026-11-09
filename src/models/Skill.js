import Entry from '@/models/Entry.js';
import { skillRange } from '@/data/skills.js';
import { abilityCatalog } from '@/data/abilities.js';

/**
 * A skill the character has trained (Mining, Axe...), scored on the shared
 * skill range. Adds a score to Entry, and knows which abilities it unlocks.
 */
export default class Skill extends Entry {
    /**
     * @param {Object} [source={}] A catalog skill, or a saved one.
     * @param {number} [value]     The score. Left out: the saved score, or
     *                             the bottom of the range for a new skill.
     */
    constructor(source = {}, value = source.value ?? skillRange.min) {
        super(source);
        this.min = skillRange.min;
        this.max = skillRange.max;
        this.value = value;
    }

    /**
     * The abilities this skill offers, from the catalog. Was abilitiesFor(skill)
     * in the forge: the skill is the one who knows (Move Method).
     *
     * @returns {Object[]} Catalog abilities, or [] if the skill has none.
     */
    get abilities() {
        const entry = abilityCatalog.find((item) => item.skillId === this.id);

        return entry === undefined ? [] : entry.abilities;
    }
}
