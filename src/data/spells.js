// Every spell the world offers, grouped by school.

// Every spell the world offers. The extra ones in each school came
// from the add menus; their level and cost are placeholders.
export const spellCatalog = [
    {
        id: 'abjuration', name: 'Abjuration', spells: [
            { id: 'arcaneWard', name: 'Arcane Ward', level: 1, cost: 10, description: 'Surround yourself with a shimmering barrier that absorbs damage.' },
            { id: 'dispelMagic', name: 'Dispel Magic', level: 3, cost: 25, description: 'End a magical effect on a creature or object.' },
            { id: 'shield', name: 'Shield', level: 1, cost: 5, description: 'A sudden barrier turns aside one incoming attack.' },
            { id: 'counterspell', name: 'Counterspell', level: 3, cost: 25, description: 'Interrupt another caster mid-incantation.' },
            { id: 'banishment', name: 'Banishment', level: 4, cost: 40, description: 'Send a creature to another plane for a time.' },
        ]
    },
    {
        id: 'conjuration', name: 'Conjuration', spells: [
            { id: 'summonFamiliar', name: 'Summon Familiar', level: 1, cost: 10, description: 'Call a small spirit animal to scout and assist you.' },
            { id: 'mistyStep', name: 'Misty Step', level: 2, cost: 15, description: 'Teleport a short distance in a puff of silver mist.' },
            { id: 'web', name: 'Web', level: 2, cost: 20, description: 'Fill an area with thick, clinging strands.' },
            { id: 'cloudkill', name: 'Cloudkill', level: 5, cost: 50, description: 'A rolling fog of poison that drifts forward.' },
            { id: 'teleport', name: 'Teleport', level: 5, cost: 55, description: 'Cross a great distance in a single step.' },
        ]
    },
    {
        id: 'divination', name: 'Divination', spells: [
            { id: 'detectMagic', name: 'Detect Magic', level: 1, cost: 5, description: 'Sense the presence of magic nearby.' },
            { id: 'clairvoyance', name: 'Clairvoyance', level: 3, cost: 30, description: 'See and hear a distant place you have visited before.' },
            { id: 'identify', name: 'Identify', level: 1, cost: 10, description: 'Learn what an object is and what it does.' },
            { id: 'locateObject', name: 'Locate Object', level: 2, cost: 20, description: 'Sense the direction of something you know well.' },
            { id: 'trueSeeing', name: 'True Seeing', level: 4, cost: 40, description: 'See through illusion, invisibility and disguise.' },
        ]
    },
    {
        id: 'enchantment', name: 'Enchantment', spells: [
            { id: 'charmPerson', name: 'Charm Person', level: 1, cost: 10, description: 'Make a humanoid treat you as a friendly acquaintance.' },
            { id: 'holdPerson', name: 'Hold Person', level: 2, cost: 20, description: 'Freeze a humanoid in place for a short time.' },
            { id: 'sleep', name: 'Sleep', level: 1, cost: 10, description: 'Send the weakest nearby creatures into slumber.' },
            { id: 'suggestion', name: 'Suggestion', level: 2, cost: 20, description: 'Plant a reasonable-sounding course of action.' },
            { id: 'confusion', name: 'Confusion', level: 4, cost: 40, description: 'Targets act at random for a short while.' },
        ]
    },
    {
        id: 'evocation', name: 'Evocation', spells: [
            { id: 'magicMissile', name: 'Magic Missile', level: 1, cost: 10, description: 'Three glowing darts that never miss their target.' },
            { id: 'fireball', name: 'Fireball', level: 3, cost: 30, description: 'A burst of flame that engulfs everything in the blast.' },
            { id: 'lightningBolt', name: 'Lightning Bolt', level: 3, cost: 30, description: 'A line of arcing lightning through everything in its path.' },
            { id: 'iceStorm', name: 'Ice Storm', level: 4, cost: 40, description: 'Hail and freezing rain batter an area.' },
            { id: 'coneOfCold', name: 'Cone of Cold', level: 5, cost: 50, description: 'A widening blast of killing cold.' },
        ]
    },
    {
        id: 'illusion', name: 'Illusion', spells: [
            { id: 'minorIllusion', name: 'Minor Illusion', level: 0, cost: 5, description: 'Create a small sound or image to fool onlookers.' },
            { id: 'invisibility', name: 'Invisibility', level: 2, cost: 20, description: 'Turn a creature invisible until it attacks.' },
            { id: 'disguiseSelf', name: 'Disguise Self', level: 1, cost: 10, description: 'Change how you appear to everyone watching.' },
            { id: 'mirrorImage', name: 'Mirror Image', level: 2, cost: 20, description: 'Duplicates of you confuse incoming attacks.' },
            { id: 'phantasmalForce', name: 'Phantasmal Force', level: 2, cost: 20, description: 'One creature believes an illusion completely.' },
        ]
    },
    {
        id: 'necromancy', name: 'Necromancy', spells: [
            { id: 'chillTouch', name: 'Chill Touch', level: 0, cost: 5, description: 'A ghostly hand that drains life and stops healing.' },
            { id: 'animateDead', name: 'Animate Dead', level: 3, cost: 35, description: 'Raise a skeleton or zombie to serve you.' },
            { id: 'falseLife', name: 'False Life', level: 1, cost: 10, description: 'Borrow vitality you do not have.' },
            { id: 'vampiricTouch', name: 'Vampiric Touch', level: 3, cost: 30, description: 'Damage dealt returns to you as health.' },
            { id: 'blight', name: 'Blight', level: 4, cost: 40, description: 'Draw the life out of a living thing.' },
        ]
    },
    {
        id: 'transmutation', name: 'Transmutation', spells: [
            { id: 'featherFall', name: 'Feather Fall', level: 1, cost: 5, description: 'Slow the fall of up to five creatures.' },
            { id: 'haste', name: 'Haste', level: 3, cost: 30, description: "Double a creature's speed and grant an extra action." },
            { id: 'enlargeReduce', name: 'Enlarge/Reduce', level: 2, cost: 20, description: 'Grow or shrink a creature or object.' },
            { id: 'stoneskin', name: 'Stoneskin', level: 4, cost: 40, description: 'Flesh hardens against blades and blunt force.' },
            { id: 'polymorph', name: 'Polymorph', level: 4, cost: 45, description: 'Change a creature into another shape entirely.' },
        ]
    },
];

// The schools a new character starts with: every school, each empty.
// Built from the catalog, so a new school only has to be added once.
// A view copies this into its data(), the same way as startingStats.
export const startingSpellSchools = spellCatalog.map((school) => ({
    id: school.id,
    name: school.name,
    spells: [],
}));
