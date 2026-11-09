import Character from '@/models/Character.js';

/**
 * A player's character. Adds the User ID of the person who plays it (one
 * user can have many characters).
 *
 * Player and Npc used to be one class with "isNpc ? ... : ..." in every
 * method that differed. Now each class answers for itself (Replace
 * Conditional with Polymorphism).
 */
export default class Player extends Character {
    /**
     * The only place the string 'player' is written. Everywhere else uses
     * Player.type (the teacher's Book.type pattern).
     */
    static type = 'player';

    static label = 'Player';

    /**
     * @param {Object} [saved={}] Saved plain data (see Character's constructor).
     */
    constructor(saved = {}) {
        super(saved);
        this.userId = saved.userId || '';
    }

    /**
     * @returns {string} The User ID, for the roster's grey badge.
     */
    get tagLabel() {
        return this.userId;
    }

    /**
     * A player also needs a User ID. super.isComplete is Character's check
     * (the name), so this adds to it rather than writing it again.
     *
     * @returns {boolean}
     */
    get isComplete() {
        return super.isComplete && this.userId.trim() !== '';
    }

    /**
     * @returns {Object} Character's fields plus the User ID.
     */
    toJSON() {
        return { ...super.toJSON(), userId: this.userId };
    }
}
