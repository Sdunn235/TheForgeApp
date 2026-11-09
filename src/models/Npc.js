import Character from '@/models/Character.js';
import { npcTypes } from '@/data/character.js';
import { findById } from '@/helpers/lists.js';

/**
 * A non-player character. Adds a creature type (Beast, Undead...) in place
 * of a player's User ID.
 */
export default class Npc extends Character {
    /**
     * The only place the string 'npc' is written. Everywhere else uses Npc.type.
     */
    static type = 'npc';

    static label = 'NPC';

    /**
     * @param {Object} [saved={}] Saved plain data (see Character's constructor).
     */
    constructor(saved = {}) {
        super(saved);
        // A new NPC starts as Unknown
        this.npcType = saved.npcType || 'unknown';
    }

    /**
     * The creature type by its readable label ("Beast", not "beast").
     *
     * @returns {string}
     */
    get tagLabel() {
        const kind = findById(npcTypes, this.npcType);

        return kind === undefined ? 'Unknown' : kind.label;
    }

    /**
     * An NPC also needs a creature type.
     *
     * @returns {boolean}
     */
    get isComplete() {
        return super.isComplete && this.npcType.trim() !== '';
    }

    /**
     * @returns {Object} Character's fields plus the creature type.
     */
    toJSON() {
        return { ...super.toJSON(), npcType: this.npcType };
    }
}
