// Small list tools for plain arrays (catalogs, lists of ids). A list the
// app manages, with add / remove / "not owned yet", is a Collection now
// (models/Collection.js), which took over notOwned. deepCopy went too:
// models copy themselves (Character.clone).
// None of these use "this": everything they need comes in as an argument.

/**
 * The entry with this id, or undefined if there is none.
 *   findById(skillCatalog, 'magic')  →  the Magic category
 *
 * @param {Object[]}      list
 * @param {string|number} id
 * @returns {Object|undefined}
 */
export function findById(list, id) {
    return list.find((entry) => entry.id === id);
}

/**
 * Take one item out of a list, in place. Works for objects (the same object
 * that is in the list) and for plain ids. Does nothing if it is not there.
 *
 * @param {Array} list
 * @param {*}     item
 */
export function removeFrom(list, item) {
    const index = list.indexOf(item);

    if (index !== -1) {
        list.splice(index, 1);
    }
}
