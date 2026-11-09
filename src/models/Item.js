import Entry from '@/models/Entry.js';
import { itemSlots, itemQtyRange } from '@/data/items.js';
import { findById } from '@/helpers/lists.js';

/**
 * An item in the bag. Adds the slot it fits and how many are spare to Entry.
 * qty counts the SPARE ones: putting one on takes it out of qty, and
 * taking it off puts it back (see Inventory.equip).
 */
export default class Item extends Entry {
    /**
     * @param {Object} [source={}] A catalog item, or a saved one.
     * @param {number} [qty]       How many. Left out: the saved amount, or
     *                             the smallest stack for a new item.
     */
    constructor(source = {}, qty = source.qty ?? itemQtyRange.min) {
        super(source);
        this.slot = source.slot || '';
        this.qty = qty;
    }

    /**
     * The slot by its readable name ("Hand", not "hand"). Was itemSlotLabel
     * in the old helpers/labels.js.
     *
     * @returns {string}
     */
    get slotLabel() {
        const slot = findById(itemSlots, this.slot);

        return slot === undefined ? this.slot : slot.label;
    }

    /**
     * Take one out of the bag, if there is one to take.
     *
     * @returns {boolean} true if one was taken, false if the bag had none.
     */
    takeOne() {
        if (this.qty < 1) {
            return false;
        }

        this.qty -= 1;

        return true;
    }

    /**
     * Put one back in the bag.
     */
    returnOne() {
        this.qty += 1;
    }
}
