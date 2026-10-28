// What the world offers, separate from what this character has.
// A catalog entry describes what a skill IS; a character's entry
// is that plus a value. That separation is what lets the add menu
// hide skills you already have, and makes "add" a one-line method.
// The descriptions on categories you have not used yet are
// placeholders — rewrite them as the game design settles.
export const skillCatalog = [
    {
        id: 'gathering',
        name: 'Gathering Skills',
        skills: [
            { id: 'mining', name: 'Mining', description: 'The skill of extracting minerals from the earth.' },
            { id: 'foraging', name: 'Foraging', description: 'The skill of gathering food from the natural environment.' },
            { id: 'lumberjacking', name: 'Lumberjacking', description: 'The skill of cutting down trees and processing the wood.' },
            { id: 'fishing', name: 'Fishing', description: 'Working line and net for what swims below.' },
            { id: 'herbalism', name: 'Herbalism', description: 'Finding and preparing useful plants.' },
            { id: 'skinning', name: 'Skinning', description: 'Taking hide and sinew from a carcass cleanly.' },
        ],
    },
    {
        id: 'oneHandedWeapons',
        name: 'One-Handed Weapons',
        skills: [
            { id: 'sword', name: 'Sword', description: 'Balanced blades for quick cuts and thrusts.' },
            { id: 'axe', name: 'Axe', description: 'Heavy chopping blows that bite through shields.' },
            { id: 'mace', name: 'Mace', description: 'Blunt strikes that crush through armor.' },
            { id: 'dagger', name: 'Dagger', description: 'Fast, close-range stabs and precise strikes.' },
            { id: 'rapier', name: 'Rapier', description: 'Point-first duelling at arm\'s length.' },
            { id: 'club', name: 'Club', description: 'Whatever is heavy and close to hand.' },
        ],
    },
    {
        id: 'mediumArmor',
        name: 'Medium Armor',
        skills: [
            { id: 'chainmail', name: 'Chainmail', description: 'Linked rings that turn aside slashing blows.' },
            { id: 'scaleMail', name: 'Scale Mail', description: 'Overlapping plates that spread out an impact.' },
            { id: 'brigandine', name: 'Brigandine', description: 'Riveted plates in cloth for quiet movement.' },
            { id: 'lamellar', name: 'Lamellar', description: 'Laced plates that flex with the body.' },
        ],
    },
    {
        id: 'twoHandedWeapons',
        name: 'Two-Handed Weapons',
        skills: [
            { id: 'greatsword', name: 'Greatsword', description: 'Long reach and weight behind every swing.' },
            { id: 'battleaxe', name: 'Battleaxe', description: 'Two hands behind a splitting edge.' },
            { id: 'warhammer', name: 'Warhammer', description: 'Armor-breaking force at close range.' },
            { id: 'halberd', name: 'Halberd', description: 'Reach, hook and point on one shaft.' },
        ],
    },
    {
        id: 'rangedWeapons',
        name: 'Ranged Weapons',
        skills: [
            { id: 'bow', name: 'Bow', description: 'Drawn and loosed at distance.' },
            { id: 'crossbow', name: 'Crossbow', description: 'Slow to load, hard to stop.' },
            { id: 'sling', name: 'Sling', description: 'Stones at speed, ammunition anywhere.' },
            { id: 'throwing', name: 'Throwing', description: 'Knives, axes and whatever else flies true.' },
        ],
    },
    {
        id: 'lightArmor',
        name: 'Light Armor',
        skills: [
            { id: 'padded', name: 'Padded', description: 'Quilted cloth that blunts a blow.' },
            { id: 'leather', name: 'Leather', description: 'Hardened hide, quiet and quick.' },
            { id: 'studdedLeather', name: 'Studded Leather', description: 'Rivets across leather for the edge that matters.' },
        ],
    },
    {
        id: 'heavyArmor',
        name: 'Heavy Armor',
        skills: [
            { id: 'bandedMail', name: 'Banded Mail', description: 'Horizontal bands over a mail backing.' },
            { id: 'halfPlate', name: 'Half Plate', description: 'Plate where it counts, mail elsewhere.' },
            { id: 'fullPlate', name: 'Full Plate', description: 'Fitted steel from head to foot.' },
        ],
    },
    {
        id: 'crafting',
        name: 'Crafting',
        skills: [
            { id: 'blacksmithing', name: 'Blacksmithing', description: 'Heat, hammer and anvil.' },
            { id: 'leatherworking', name: 'Leatherworking', description: 'Curing hide into something that lasts.' },
            { id: 'alchemy', name: 'Alchemy', description: 'Drawing effects out of reagents.' },
            { id: 'cooking', name: 'Cooking', description: 'Turning raw supplies into something worth eating.' },
        ],
    },
    {
        id: 'magic',
        name: 'Magic',
        skills: [
            { id: 'abjuration', name: 'Abjuration', description: 'Wards, barriers and dispelling.' },
            { id: 'conjuration', name: 'Conjuration', description: 'Calling things from elsewhere.' },
            { id: 'evocation', name: 'Evocation', description: 'Raw energy shaped and thrown.' },
            { id: 'illusion', name: 'Illusion', description: 'What the senses can be made to believe.' },
            { id: 'necromancy', name: 'Necromancy', description: 'The line between living and not.' },
        ],
    },
];

// The range every skill is scored on. One knob rather than the
// same 1 and 100 written out thirty times.
export const skillRange = { min: 1, max: 100 };