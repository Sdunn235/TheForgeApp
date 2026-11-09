import Collection from '@/models/Collection.js';
import Item from '@/models/Item.js';
import { startingGearSlots } from '@/data/items.js';

/**
 * What a character carries (the items) and wears (the gear slots). One
 * class for both, because equipping is a trade between them: putting an
 * item on takes one out of the bag. Before, these six methods sat in the
 * forge and reached into two separate lists (Feature Envy).
 *
 * A gear slot is plain data: { id, label, accepts, equipped }. equipped
 * holds an item's id, or '' for an empty slot.
 */
export default class Inventory extends Collection {
    /**
     * @param {Object[]} [saved=[]]                     Saved items, rebuilt as Item objects.
     * @param {Object[]} [gearSlots=startingGearSlots]  Saved gear slots. Copied,
     *                                                  so the starting list never changes.
     */
    constructor(saved = [], gearSlots = startingGearSlots) {
        super(saved.map((item) => new Item(item)));
        this.gearSlots = gearSlots.map((slot) => ({ ...slot }));
    }

    /**
     * Each gear slot with the equipped item's name, for the roster's sheet.
     * Moved here from the old Character model.
     *
     * @returns {{id: string, label: string, itemName: string, filled: boolean}[]}
     */
    get gear() {
        return this.gearSlots.map((slot) => {
            const item = this.find(slot.equipped);

            return {
                id: slot.id,
                label: slot.label,
                itemName: item === undefined ? 'Empty' : item.name,
                filled: item !== undefined,
            };
        });
    }

    /**
     * What a gear slot could hold: whatever fits and is still in the bag,
     * plus whatever is already in the slot (or there'd be no way to take it off).
     *
     * @param {Object} slot One of this.gearSlots.
     * @returns {Item[]}
     */
    equippableIn(slot) {
        return this.filter((item) => {
            return item.slot === slot.accepts && (item.qty > 0 || item.id === slot.equipped);
        });
    }

    /**
     * Put an item in a slot. Taking off puts one back in the bag, putting on
     * takes one out, and swapping does both, in that order. Without this,
     * two hand slots could wear the same single dagger.
     *
     * @param {Object} slot   One of this.gearSlots.
     * @param {string} itemId The item to wear, or '' to empty the slot.
     */
    equip(slot, itemId) {
        const worn = this.find(slot.equipped);

        if (worn !== undefined) {
            worn.returnOne();
        }

        slot.equipped = '';

        const item = this.find(itemId);

        if (item !== undefined && item.takeOne()) {
            slot.equipped = itemId;
        }
    }

    /**
     * How many of this item are being worn. qty is what's spare, so 1 worn
     * with 0 spare still reads correctly.
     *
     * @param {Item} item
     * @returns {number}
     */
    wornCount(item) {
        return this.gearSlots.filter((slot) => slot.equipped === item.id).length;
    }

    /**
     * Drop an item. It comes off every slot first, so no slot points at an
     * item the bag no longer has. This overrides Collection's remove, then
     * calls it with super to do the actual removing.
     *
     * @param {Item} item
     */
    remove(item) {
        for (const slot of this.gearSlots) {
            if (slot.equipped === item.id) {
                slot.equipped = '';
            }
        }

        super.remove(item);
    }
}
