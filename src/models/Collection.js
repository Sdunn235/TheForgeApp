/**
 * A list that manages itself: add, remove, find, count. The list code that
 * was written out again and again in the views (push, indexOf + splice,
 * notOwned) now lives here once. Built like the teacher's
 * PublicationCollection: it HAS an array rather than being one (composition).
 *
 * Every entry is matched by its id, so two copies of the same thing count as
 * the same thing.
 *
 * Subclasses add the rules of one kind of list: FeatList, Inventory, Roster,
 * and EntryGroup.
 */
export default class Collection {
    /**
     * @param {Array} [arr=[]] The entries to start with. Anything that is
     *                         not an array starts the collection empty.
     */
    constructor(arr = []) {
        // "Private" by agreement: the underscore means "outside code, don't
        // touch". Not a real #private field, because Vue wraps every object
        // in a Proxy, and #private fields break inside one.
        this._arr = Array.isArray(arr) ? arr : [];
    }

    /**
     * @returns {number} How many entries there are.
     */
    get count() {
        return this._arr.length;
    }

    /**
     * A COPY of the entries, for v-for and for passing to a component. It
     * is a copy so nothing outside can push or splice the real list behind
     * the collection's back. The entries in it are the real ones.
     *
     * @returns {Array}
     */
    get items() {
        return [...this._arr];
    }

    /**
     * @param {Object} entry Anything with an id.
     * @returns {Object} The entry that was added.
     */
    add(entry) {
        this._arr.push(entry);

        return entry;
    }

    /**
     * Take an entry out. Does nothing if it is not there.
     *
     * @param {Object} entry Anything with the same id as the one to remove.
     */
    remove(entry) {
        const index = this._indexOf(entry);

        if (index !== -1) {
            this._arr.splice(index, 1);
        }
    }

    /**
     * @param {Object} entry Anything with an id.
     * @returns {boolean} true if an entry with that id is here.
     */
    contains(entry) {
        return this._indexOf(entry) !== -1;
    }

    /**
     * @param {string|number} id
     * @returns {Object|undefined} The entry with that id, or undefined.
     */
    find(id) {
        return this._arr.find((entry) => entry.id === id);
    }

    /**
     * The entries that pass a test, like an array's filter.
     *
     * @param {function(Object): boolean} test
     * @returns {Array}
     */
    filter(test) {
        return this._arr.filter(test);
    }

    /**
     * The catalog entries this collection does not have yet. This is what
     * keeps a + menu from offering something twice. Was notOwned() in
     * helpers/lists.js.
     *
     * @param {Object[]} catalog
     * @returns {Object[]}
     */
    missingFrom(catalog) {
        return catalog.filter((entry) => !this.contains(entry));
    }

    /**
     * What JSON.stringify writes for a collection: just the entries. Without
     * this a saved list would come out as { "_arr": [...] }.
     *
     * @returns {Array}
     */
    toJSON() {
        return this.items;
    }

    /**
     * Where an entry sits, matched by id. Internal: the underscore says so.
     *
     * @param {Object} entry
     * @returns {number} Its index, or -1.
     */
    _indexOf(entry) {
        return this._arr.findIndex((item) => item.id === entry.id);
    }
}
