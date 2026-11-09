import Collection from '@/models/Collection.js';
import Entry from '@/models/Entry.js';

/**
 * A named group of entries: a skill category holding its skills, or a
 * spell school holding its spells. The two had the same shape (id, name, a
 * list) and the same jobs, so they are one class (DRY). Two classes only
 * earn their keep when their fields or methods differ, and these don't.
 */
export default class EntryGroup extends Collection {
    /**
     * @param {Object}   [source={}]        A catalog category or school (starts
     *                                      empty), or a saved group (its entries).
     * @param {Function} [EntryClass=Entry] The class each entry is rebuilt as:
     *                                      Skill for a category, Spell for a school.
     */
    constructor(source = {}, EntryClass = Entry) {
        // super() must run before "this" can be used
        super((source.entries || []).map((entry) => new EntryClass(entry)));
        this.id = source.id || '';
        this.name = source.name || '';
    }

    /**
     * A group saves its name with its entries, unlike a plain Collection.
     *
     * @returns {{id: string, name: string, entries: Array}}
     */
    toJSON() {
        return { id: this.id, name: this.name, entries: this.items };
    }
}
