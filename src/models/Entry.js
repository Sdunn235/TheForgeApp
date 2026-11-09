/**
 * The base class for everything a character copies out of a catalog: a
 * skill, a spell, an item, a feat or an effect. All five have an id, a name
 * and a description, so those three are written once, here (inheritance).
 * Each subclass adds only what makes it different.
 *
 * A character gets its OWN copy of a catalog entry. Sharing the catalog
 * object would mean raising Mining on one character raises it on everyone.
 * This replaces the make...() functions in the old helpers/builders.js.
 */
export default class Entry {
    /**
     * Copies the shared fields. Works with a catalog entry (the + menus) and
     * with the same entry as it was saved (a clone), so there is one way in.
     *
     * @param {Object} [source={}] A catalog entry, or a saved copy of one.
     */
    constructor(source = {}) {
        this.id = source.id || '';
        this.name = source.name || '';
        this.description = source.description || '';
    }
}
