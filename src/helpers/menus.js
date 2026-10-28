// Any + menu: a heading, then one choice per catalog entry. The entry rides
// along inside each choice, so ActionMenu hands it back on a click.
//   addMenu('Choose a category', availableCategories)
export function addMenu(header, entries) {
    const choices = entries.map((entry) => ({
        label: entry.name,
        entry: entry,
    }));

    return [{ header: header }].concat(choices);
}
