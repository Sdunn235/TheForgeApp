import Collection from '@/models/Collection.js';

/**
 * Every saved character. A Collection, plus the roster's own jobs: handing
 * out ids, saving (add or replace), and searching and sorting. The search
 * and sort used to be one 40-line computed in RosterView, and the id
 * counter lived in localStorage (helpers/storage.js).
 */
export default class Roster extends Collection {
    /**
     * The roster's sort orders, by the id the Sort By buttons use. Each is a
     * compare function for sort(): negative puts first before second.
     * static: one set for every roster, not a copy per roster.
     */
    static sorts = {
        name: (first, second) => first.name.localeCompare(second.name),
        level: (first, second) => second.level - first.level,
        newest: (first, second) => second.id - first.id,
    };

    /**
     * @param {Character[]} [characters=[]]
     */
    constructor(characters = []) {
        super(characters);
        // The next id to hand out. It only goes up, so an id is never
        // handed out twice, even after a delete.
        this._nextId = 0;
    }

    /**
     * Save a character. A new one (id null) takes the next id and joins the
     * roster. An edit already has its id, so it replaces itself, no matter
     * what was renamed.
     *
     * @param {Character} character The copy to keep (the forge hands over a clone).
     * @returns {number} The id it was saved under.
     */
    save(character) {
        character.savedAt = new Date().toISOString();

        if (character.id === null) {
            character.id = this._nextId;
            this._nextId++;
        }

        const index = this._indexOf(character);

        if (index === -1) {
            this.add(character);
        } else {
            this._arr[index] = character;
        }

        return character.id;
    }

    /**
     * The characters that pass the search box and the filters, sorted.
     * Every filter is optional; leave one out and it lets everything through.
     *
     * @param {Object}   [filters={}]
     * @param {string}   [filters.type='all']     'all', or Player.type / Npc.type.
     * @param {string}   [filters.creature='all'] 'all', or one of data/character.js npcTypes.
     * @param {string}   [filters.field='name']   Where to look: 'name' or 'userId'.
     * @param {string}   [filters.term='']        What to look for. Case doesn't matter.
     * @param {number[]} [filters.exclude=[]]     Ids to leave out (the locked cards).
     * @param {string}   [filters.sort='name']    A key of Roster.sorts.
     * @returns {Character[]} A new array; the roster itself is not reordered.
     */
    search({ type = 'all', creature = 'all', field = 'name', term = '', exclude = [], sort = 'name' } = {}) {
        const wanted = term.trim().toLowerCase();

        const matches = this.filter((character) => {
            if (exclude.includes(character.id)) {
                return false;
            }

            if (type !== 'all' && character.type !== type) {
                return false;
            }

            if (creature !== 'all' && character.npcType !== creature) {
                return false;
            }

            // A Player has a userId and an Npc does not, so '' stands in
            const haystack = character[field] || '';

            return haystack.toLowerCase().includes(wanted);
        });

        // filter() made a new array, so sorting it leaves the roster alone
        return matches.sort(Roster.sorts[sort] || Roster.sorts.name);
    }
}
