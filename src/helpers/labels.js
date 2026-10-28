import { itemSlots } from '@/data/items.js';
import { findById } from '@/helpers/lists.js';

// How a spell's or an item's numbers read on screen. The forge and the
// roster both show them, so the wording is written once.

// Level 0 is a cantrip, which is not "Level 0" to anyone who plays.
export function spellLevelLabel(spell) {
    return spell.level === 0 ? 'Cantrip' : 'Level ' + spell.level;
}

export function spellCostLabel(spell) {
    return spell.cost + ' Mana';
}

// An item's slot by its readable name ("Hand", not "hand").
export function itemSlotLabel(item) {
    const slot = findById(itemSlots, item.slot);

    return slot === undefined ? item.slot : slot.label;
}
