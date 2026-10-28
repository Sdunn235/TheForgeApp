// Small list tools the whole app uses. Each one replaces a line that was
// written out again and again in app.js (Duplicate Code → Extract Method).
// None of them use "this": everything they need comes in as an argument.

// The entry with this id, or undefined if there is none.
//   findById(skillCatalog, 'magic')  →  the Magic category
export function findById(list, id) {
    return list.find((entry) => entry.id === id);
}

// Take one item out of a list, in place. Works for objects (the same object
// that is in the list) and for plain ids. Does nothing if it is not there.
export function removeFrom(list, item) {
    const index = list.indexOf(item);

    if (index !== -1) {
        list.splice(index, 1);
    }
}

// A full copy of plain data, nested lists and all, so changing the copy can
// never change the original (the JSON round trip). Used for the starting
// lists a page edits, and for saving and loading a character.
export function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}

// The catalog entries the character does not have yet, matched by id.
// This is what keeps an add menu from offering something twice.
export function notOwned(catalog, owned) {
    return catalog.filter((entry) => {
        return !owned.some((mine) => mine.id === entry.id);
    });
}
