// Every item the world offers, the slots they fit, and the gear slots a new character starts with.

// Everything that exists to pick up. The ones not already carried
// came from the add menu; their descriptions are placeholders.
export const itemCatalog = [
    { id: 'ironHelm', name: 'Iron Helm', slot: 'head', description: '+5 defense. A sturdy helm of hammered iron.' },
    { id: 'leatherHood', name: 'Leather Hood', slot: 'head', description: '+2 defense. Quiet, and no weight to speak of.' },
    { id: 'shortSword', name: 'Short Sword', slot: 'hand', description: '+4 slashing damage. Light and quick to swing.' },
    { id: 'handAxe', name: 'Hand Axe', slot: 'hand', description: '+5 chopping damage. Heavy through the swing.' },
    { id: 'dagger', name: 'Dagger', slot: 'hand', description: '+3 piercing damage. Fast, and easy to keep hidden.' },
    { id: 'woodenShield', name: 'Wooden Shield', slot: 'hand', description: '+3 defense. 20% chance to block an attack.' },
    { id: 'chainmailLeggings', name: 'Chainmail Leggings', slot: 'legs', description: '+4 defense. Extra protection against slashing attacks.' },
    { id: 'leatherPants', name: 'Leather Pants', slot: 'legs', description: '+2 defense. Little to carry and quiet to move in.' },
    { id: 'ringOfVigor', name: 'Ring of Vigor', slot: 'accessory', description: '+10 max health while worn.' },
    { id: 'amuletOfWarding', name: 'Amulet of Warding', slot: 'accessory', description: 'Reduces magic damage taken by 10%.' },
    { id: 'luckyCharm', name: 'Lucky Charm', slot: 'accessory', description: 'A small push toward rarer finds.' },
    { id: 'healthPotion', name: 'Health Potion', slot: 'consumable', description: 'Restores 50 health when used.' },
    { id: 'manaPotion', name: 'Mana Potion', slot: 'consumable', description: 'Restores 40 mana when used.' },
    { id: 'antidote', name: 'Antidote', slot: 'consumable', description: 'Cures poison.' },
    { id: 'torch', name: 'Torch', slot: 'consumable', description: 'An hour of light against the dark.' },
    { id: 'rope', name: 'Rope', slot: 'consumable', description: 'Fifty feet of sturdy hemp.' },
    { id: 'bread', name: 'Bread', slot: 'consumable', description: 'Restores a little health over time.' },
];

// The kinds of thing an item can be. A slot's badge and the gear
// slots it fits both read from here.
export const itemSlots = [
    { id: 'head', label: 'Head' },
    { id: 'hand', label: 'Hand' },
    { id: 'legs', label: 'Legs' },
    { id: 'accessory', label: 'Accessory' },
    { id: 'consumable', label: 'Consumable' },
];

// What the character is wearing. accepts names the kind of item
// the slot takes; equipped holds an inventory item's id, or '' for
// empty. The options come from the inventory, so you can only put
// on something you are actually carrying.
export const startingGearSlots = [
    { id: 'gearHead', label: 'Head', accepts: 'head', equipped: '' },
    { id: 'gearLeftHand', label: 'L. Hand', accepts: 'hand', equipped: '' },
    { id: 'gearRightHand', label: 'R. Hand', accepts: 'hand', equipped: '' },
    { id: 'gearLegs', label: 'Legs', accepts: 'legs', equipped: '' },
    { id: 'gearAccessory1', label: 'Accessory 1', accepts: 'accessory', equipped: '' },
    { id: 'gearAccessory2', label: 'Accessory 2', accepts: 'accessory', equipped: '' },
];

// How many of one item may stack.
export const itemQtyRange = { min: 1, max: 99 };
