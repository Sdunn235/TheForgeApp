import Entry from '@/models/Entry.js';

/**
 * A buff or debuff on the character. Adds its kind and how long it lasts to Entry.
 */
export default class Effect extends Entry {
    /**
     * @param {Object} [source={}] A catalog effect, or a saved one.
     */
    constructor(source = {}) {
        super(source);
        this.kind = source.kind || '';
        this.duration = source.duration || '';
    }

    /**
     * @returns {boolean} true for a buff, false for a debuff.
     */
    get isBuff() {
        return this.kind === 'buff';
    }
}
