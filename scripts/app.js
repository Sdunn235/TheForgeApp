import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
    // data: all the data for the app
    data: function () {
        return {
            // Heading text for the home page
            appName: 'Welcome to The Forge',
            tagline: 'This is the description for The Forge. Explain Use and design in a high top-down approach.',

            // One entry per design area on the home page: its words, its art,
            // and the two links in its menu.
            forges: [
                {
                    title: 'Character Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'Create, edit, or view characters and NPCs in the world.',
                    buttonLabel: 'Forge Characters',
                    links: [
                        { label: 'Create/Edit', href: 'creation-character.html' },
                        { label: 'View Characters', href: 'view-characters.html' },
                    ],
                },
                {
                    title: 'Attributes Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'Drives your character\'s attributes to their true potential.',
                    buttonLabel: 'Forge Attributes',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Attributes', href: '#' },
                    ],
                },
                {
                    title: 'Skill Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where skills are defined and grouped into categories. Gathering, weapon handling, armor training and whatever else the world needs, each with its description and the range a character levels it through.',
                    buttonLabel: 'Forge Skills',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Skills', href: '#' },
                    ],
                },
                {
                    title: 'Ability Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where abilities are written. These are what a character unlocks as a skill grows: what each one does, which skill category it belongs under, and what it takes to learn.',
                    buttonLabel: 'Forge Abilities',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Abilities', href: '#' },
                    ],
                },
                {
                    title: 'Feat Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where feats are written. These are the perks a character earns every few levels: what each one grants, whether it is earned or given as a bonus, and how many a character may hold.',
                    buttonLabel: 'Forge Feats',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Feats', href: '#' },
                    ],
                },
                {
                    title: 'Spell Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where spells are written and sorted into schools. Abjuration through transmutation, each spell carrying its level, its mana cost, and what happens when it is cast.',
                    buttonLabel: 'Forge Spells',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Spells', href: '#' },
                    ],
                },
                {
                    title: 'Effect Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where buffs and debuffs are written. These are the temporary states a character carries: what each one changes, how long it holds, and whether it helps or hurts.',
                    buttonLabel: 'Forge Effects',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Effects', href: '#' },
                    ],
                },
                {
                    title: 'Item Design',
                    image: 'Assets/Images/anvil.png',
                    alt: 'Hammer and anvil',
                    description: 'This is where gear and inventory are made. Weapons, armor, consumables and curiosities, each with the slot it fills, the quantity it stacks to, and what it does for whoever carries it.',
                    buttonLabel: 'Forge Items',
                    links: [
                        { label: 'Create/Edit', href: '#' },
                        { label: 'View Items', href: '#' },
                    ],
                },
            ],

            // The six attributes. min/max live here so the ranges are data,
            // not numbers buried in the markup.
            stats: [
                {
                    id: 'strength',
                    label: 'Strength',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Physical power, lifting, and close-combat force.',
                },
                {
                    id: 'dexterity',
                    label: 'Dexterity',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Speed, coordination, balance, and precision.',
                },
                {
                    id: 'constitution',
                    label: 'Constitution',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Endurance, toughness, and resistance to harm.',
                },
                {
                    id: 'intelligence',
                    label: 'Intelligence',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Reasoning, memory, learning, and problem-solving.',
                },
                {
                    id: 'wisdom',
                    label: 'Wisdom',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Awareness, perception, judgment, and intuition.',
                },
                {
                    id: 'charisma',
                    label: 'Charisma',
                    min: 1,
                    max: 20,
                    value: 1,
                    description: 'Confidence, presence, influence, and leadership.',
                },
            ],
            // The skills this character actually has, grouped the way the
            // accordion shows them. A category holds its own skills, and that
            // nesting is what makes the markup a loop inside a loop.
            // A new character starts with nothing. Everything below is picked
            // on its step, from the catalogs further down.
            skillCategories: [],

            // What the world offers, separate from what this character has.
            // A catalog entry describes what a skill IS; a character's entry
            // is that plus a value. That separation is what lets the add menu
            // hide skills you already have, and makes "add" a one-line method.
            // The descriptions on categories you have not used yet are
            // placeholders — rewrite them as the game design settles.
            skillCatalog: [
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
            ],

            // The range every skill is scored on. One knob rather than the
            // same 1 and 100 written out thirty times.
            skillRange: { min: 1, max: 100 },

            // The six steps of the form, in order. The tracker dots and the
            // step panels both read this, so adding a step is one entry here.
            steps: [
                { id: 'character', label: 'Character' },
                { id: 'stats', label: 'Stats' },
                { id: 'skills', label: 'Skills' },
                { id: 'abilities', label: 'Abilities' },
                { id: 'spells', label: 'Spells' },
                { id: 'items', label: 'Items' },
            ],

            // Which step is showing. 0 is the first one.
            currentStep: 0,

            // What the first step collects.
            character: {
                name: '',
                type: 'player', // 'player' or 'npc'
                userId: '',
                npcId: '',
            },

            // The Vitals card. Current values only — every ceiling below is
            // computed from the stats and the level, so there is nowhere to
            // store a maximum that disagrees with the equation.
            // Anything starting above its ceiling is pulled down on load.
            vitals: {
                level: 1,
                hp: 42,
                mp: 12,
                sp: 28,
            },

            // Level is the one vital whose range is fixed rather than derived.
            levelRange: { min: 1, max: 50 },

            // Stat points: what you start with, and what each level adds.
            // Six stats capped at 20 could absorb 114, so the budget stays
            // under that until very high level. Both are yours to tune.
            statPointsBase: 60,
            statPointsPerLevel: 1,

            // The alert under the form. Empty text means it stays hidden.
            message: {
                text: '',
                kind: 'alert-success',
            },
            // Buffs and debuffs currently on the character. kind decides which
            // column an effect lands in and what colour its badge is, so one
            // list covers both.
            effects: [],

            // What can be applied. Same catalog idea as the skills: this is
            // what exists in the world, effects[] is what is on this character.
            // Durations and descriptions on the unused ones are placeholders.
            effectCatalog: [
                { id: 'blessed', name: 'Blessed', kind: 'buff', duration: '10m', description: '+2 to all saving throws.' },
                { id: 'hearty', name: 'Hearty', kind: 'buff', duration: '30m', description: '+5 max HP while active.' },
                { id: 'swift', name: 'Swift', kind: 'buff', duration: '10m', description: '+10 movement while active.' },
                { id: 'focused', name: 'Focused', kind: 'buff', duration: '15m', description: '+2 to spell accuracy.' },
                { id: 'poisoned', name: 'Poisoned', kind: 'debuff', duration: '2m', description: 'Lose 1 HP every 6 seconds.' },
                { id: 'slowed', name: 'Slowed', kind: 'debuff', duration: '1m', description: 'Movement halved.' },
                { id: 'weakened', name: 'Weakened', kind: 'debuff', duration: '5m', description: '-2 to Strength checks.' },
                { id: 'cursed', name: 'Cursed', kind: 'debuff', duration: '30m', description: 'All saving throws at -2.' },
            ],
            // Feats the character holds. kind groups them in the add menu and
            // sets the first badge; source says whether a level earned the
            // slot or it was granted on top.
            feats: [],

            // Every feat the world offers. summary is the short line the add
            // menu shows; description is the full text on the row's tooltip.
            featCatalog: [
                { id: 'abilityPoints2', name: '+2 Ability Points', kind: 'points', summary: 'two extra ability points', description: 'Two extra ability points to spend.' },
                { id: 'toughness', name: 'Toughness', kind: 'special', summary: '+10 max HP', description: '+10 max HP. Hardy against everything.' },
                { id: 'ironWill', name: 'Iron Will', kind: 'special', summary: 'resist fear and charm', description: 'Resist fear and charm effects.' },
                { id: 'quickDraw', name: 'Quick Draw', kind: 'special', summary: 'act first in a fight', description: 'Act before anyone else when a fight begins.' },
                { id: 'arcaneGift', name: 'Arcane Gift', kind: 'special', summary: '+15 max MP', description: '+15 max MP. A knack for the arcane.' },
                { id: 'sureFooted', name: 'Sure-Footed', kind: 'special', summary: 'ignore rough terrain', description: 'Rough terrain costs you no extra movement.' },
            ],

            // The two kinds, in menu order. label heads the menu group and tag
            // goes on the row badge — the wording differs on purpose.
            featKinds: [
                { id: 'points', label: 'Ability Points', tag: 'Ability Points', badgeClass: 'bg-primary' },
                { id: 'special', label: 'Special Features', tag: 'Special', badgeClass: 'bg-primary' },
            ],

            // Where a feat's slot came from.
            featSources: [
                { id: 'earned', tag: 'Earned', badgeClass: 'bg-success' },
                { id: 'bonus', tag: 'Bonus', badgeClass: 'bg-secondary text-dark' },
            ],

            // One feat every this many levels.
            featsPerLevel: 4,

            // How many feats this character may hold. The levels set the floor;
            // anything above that was granted.
            featAllowance: 0,

            // Which abilities this character has learned, by id. Abilities
            // themselves are not stored here — they belong to skills, and the
            // skills come from the catalog — so a skill picked on step 3
            // brings its abilities with it and nothing can disagree.
            learnedAbilities: [],

            // What each skill unlocks. requires gates the toggle: any of
            // skill / stat / level, all optional. These thresholds are game
            // design and meant to be tuned.
            abilityCatalog: [
                {
                    skillId: 'mining',
                    abilities: [
                        { id: 'richVeins', name: 'Rich Veins', description: 'Pull 25% more ore from every mining node.', requires: { skill: 25 } },
                        { id: 'steadyPick', name: 'Steady Pick', description: 'Your pickaxe loses durability half as fast.', requires: { skill: 50, stat: { id: 'constitution', value: 8 } } },
                    ],
                },
                {
                    skillId: 'foraging',
                    abilities: [
                        { id: 'keenEye', name: 'Keen Eye', description: 'Spot rare herbs and mushrooms more often.', requires: { skill: 25, stat: { id: 'wisdom', value: 8 } } },
                        { id: 'bountifulHarvest', name: 'Bountiful Harvest', description: 'Every harvest yields one extra item.', requires: { skill: 50 } },
                    ],
                },
                {
                    skillId: 'lumberjacking',
                    abilities: [
                        { id: 'cleanCut', name: 'Clean Cut', description: 'Trees produce larger, higher quality logs.', requires: { skill: 25 } },
                        { id: 'timber', name: 'Timber!', description: 'Fell trees 30% faster.', requires: { skill: 50, stat: { id: 'strength', value: 10 } } },
                    ],
                },
                {
                    skillId: 'sword',
                    abilities: [
                        { id: 'riposte', name: 'Riposte', description: 'After a successful block, strike back instantly.', requires: { skill: 25, stat: { id: 'dexterity', value: 8 } } },
                        { id: 'keenEdge', name: 'Keen Edge', description: 'Critical hits with a sword deal 20% extra damage.', requires: { skill: 50, level: 5 } },
                    ],
                },
                {
                    skillId: 'axe',
                    abilities: [
                        { id: 'cleave', name: 'Cleave', description: 'Your swings also hit one enemy standing next to your target.', requires: { skill: 25, stat: { id: 'strength', value: 10 } } },
                        { id: 'rend', name: 'Rend', description: 'Axe hits cause bleeding damage over time.', requires: { skill: 50 } },
                    ],
                },
                {
                    skillId: 'mace',
                    abilities: [
                        { id: 'crushingBlow', name: 'Crushing Blow', description: "Mace attacks ignore 25% of the target's armor.", requires: { skill: 25, stat: { id: 'strength', value: 12 } } },
                        { id: 'stagger', name: 'Stagger', description: 'Heavy hits have a chance to stun the target.', requires: { skill: 50, level: 5 } },
                    ],
                },
                {
                    skillId: 'dagger',
                    abilities: [
                        { id: 'backstab', name: 'Backstab', description: 'Deal double damage when attacking from behind.', requires: { skill: 25, stat: { id: 'dexterity', value: 12 } } },
                        { id: 'quickStrikes', name: 'Quick Strikes', description: 'Attack 15% faster with daggers.', requires: { skill: 50 } },
                    ],
                },
                {
                    skillId: 'chainmail',
                    abilities: [
                        { id: 'linkedRings', name: 'Linked Rings', description: 'Adds extra defense against slashing attacks.', requires: { skill: 25 } },
                        { id: 'deflect', name: 'Deflect', description: 'Chance for incoming blows to glance off for half damage.', requires: { skill: 50, stat: { id: 'constitution', value: 10 } } },
                    ],
                },
                {
                    skillId: 'scaleMail',
                    abilities: [
                        { id: 'overlappingPlates', name: 'Overlapping Plates', description: 'Adds extra defense against arrows and piercing attacks.', requires: { skill: 25 } },
                        { id: 'hardenedScales', name: 'Hardened Scales', description: 'Gain bonus defense while below half health.', requires: { skill: 50, level: 5 } },
                    ],
                },
                {
                    skillId: 'brigandine',
                    abilities: [
                        { id: 'rivetedGuard', name: 'Riveted Guard', description: 'Increases overall defense by 10%.', requires: { skill: 25 } },
                        { id: 'lightStep', name: 'Light Step', description: 'Armor drains less stamina while running.', requires: { skill: 50, stat: { id: 'dexterity', value: 10 } } },
                    ],
                },
            ],

            // The schools this character has, and the spells in each. Same
            // shape as skillCategories: a container holding its own items.
            // The eight schools are fixed - they belong to the world, not to a
            // character - so a new character has all of them, each empty.
            spellSchools: [
                { id: 'abjuration', name: 'Abjuration', spells: [] },
                { id: 'conjuration', name: 'Conjuration', spells: [] },
                { id: 'divination', name: 'Divination', spells: [] },
                { id: 'enchantment', name: 'Enchantment', spells: [] },
                { id: 'evocation', name: 'Evocation', spells: [] },
                { id: 'illusion', name: 'Illusion', spells: [] },
                { id: 'necromancy', name: 'Necromancy', spells: [] },
                { id: 'transmutation', name: 'Transmutation', spells: [] },
            ],

            // Which spells are in the spellbook, by id. A spell can be on the
            // character's list without being learned, the same way an ability
            // is offered by a skill without being taken.
            learnedSpells: [],

            // Every spell the world offers. The extra ones in each school came
            // from the add menus; their level and cost are placeholders.
            spellCatalog: [
                { id: 'abjuration', name: 'Abjuration', spells: [
                    { id: 'arcaneWard', name: 'Arcane Ward', level: 1, cost: 10, description: 'Surround yourself with a shimmering barrier that absorbs damage.' },
                    { id: 'dispelMagic', name: 'Dispel Magic', level: 3, cost: 25, description: 'End a magical effect on a creature or object.' },
                    { id: 'shield', name: 'Shield', level: 1, cost: 5, description: 'A sudden barrier turns aside one incoming attack.' },
                    { id: 'counterspell', name: 'Counterspell', level: 3, cost: 25, description: 'Interrupt another caster mid-incantation.' },
                    { id: 'banishment', name: 'Banishment', level: 4, cost: 40, description: 'Send a creature to another plane for a time.' },
                ] },
                { id: 'conjuration', name: 'Conjuration', spells: [
                    { id: 'summonFamiliar', name: 'Summon Familiar', level: 1, cost: 10, description: 'Call a small spirit animal to scout and assist you.' },
                    { id: 'mistyStep', name: 'Misty Step', level: 2, cost: 15, description: 'Teleport a short distance in a puff of silver mist.' },
                    { id: 'web', name: 'Web', level: 2, cost: 20, description: 'Fill an area with thick, clinging strands.' },
                    { id: 'cloudkill', name: 'Cloudkill', level: 5, cost: 50, description: 'A rolling fog of poison that drifts forward.' },
                    { id: 'teleport', name: 'Teleport', level: 5, cost: 55, description: 'Cross a great distance in a single step.' },
                ] },
                { id: 'divination', name: 'Divination', spells: [
                    { id: 'detectMagic', name: 'Detect Magic', level: 1, cost: 5, description: 'Sense the presence of magic nearby.' },
                    { id: 'clairvoyance', name: 'Clairvoyance', level: 3, cost: 30, description: 'See and hear a distant place you have visited before.' },
                    { id: 'identify', name: 'Identify', level: 1, cost: 10, description: 'Learn what an object is and what it does.' },
                    { id: 'locateObject', name: 'Locate Object', level: 2, cost: 20, description: 'Sense the direction of something you know well.' },
                    { id: 'trueSeeing', name: 'True Seeing', level: 4, cost: 40, description: 'See through illusion, invisibility and disguise.' },
                ] },
                { id: 'enchantment', name: 'Enchantment', spells: [
                    { id: 'charmPerson', name: 'Charm Person', level: 1, cost: 10, description: 'Make a humanoid treat you as a friendly acquaintance.' },
                    { id: 'holdPerson', name: 'Hold Person', level: 2, cost: 20, description: 'Freeze a humanoid in place for a short time.' },
                    { id: 'sleep', name: 'Sleep', level: 1, cost: 10, description: 'Send the weakest nearby creatures into slumber.' },
                    { id: 'suggestion', name: 'Suggestion', level: 2, cost: 20, description: 'Plant a reasonable-sounding course of action.' },
                    { id: 'confusion', name: 'Confusion', level: 4, cost: 40, description: 'Targets act at random for a short while.' },
                ] },
                { id: 'evocation', name: 'Evocation', spells: [
                    { id: 'magicMissile', name: 'Magic Missile', level: 1, cost: 10, description: 'Three glowing darts that never miss their target.' },
                    { id: 'fireball', name: 'Fireball', level: 3, cost: 30, description: 'A burst of flame that engulfs everything in the blast.' },
                    { id: 'lightningBolt', name: 'Lightning Bolt', level: 3, cost: 30, description: 'A line of arcing lightning through everything in its path.' },
                    { id: 'iceStorm', name: 'Ice Storm', level: 4, cost: 40, description: 'Hail and freezing rain batter an area.' },
                    { id: 'coneOfCold', name: 'Cone of Cold', level: 5, cost: 50, description: 'A widening blast of killing cold.' },
                ] },
                { id: 'illusion', name: 'Illusion', spells: [
                    { id: 'minorIllusion', name: 'Minor Illusion', level: 0, cost: 5, description: 'Create a small sound or image to fool onlookers.' },
                    { id: 'invisibility', name: 'Invisibility', level: 2, cost: 20, description: 'Turn a creature invisible until it attacks.' },
                    { id: 'disguiseSelf', name: 'Disguise Self', level: 1, cost: 10, description: 'Change how you appear to everyone watching.' },
                    { id: 'mirrorImage', name: 'Mirror Image', level: 2, cost: 20, description: 'Duplicates of you confuse incoming attacks.' },
                    { id: 'phantasmalForce', name: 'Phantasmal Force', level: 2, cost: 20, description: 'One creature believes an illusion completely.' },
                ] },
                { id: 'necromancy', name: 'Necromancy', spells: [
                    { id: 'chillTouch', name: 'Chill Touch', level: 0, cost: 5, description: 'A ghostly hand that drains life and stops healing.' },
                    { id: 'animateDead', name: 'Animate Dead', level: 3, cost: 35, description: 'Raise a skeleton or zombie to serve you.' },
                    { id: 'falseLife', name: 'False Life', level: 1, cost: 10, description: 'Borrow vitality you do not have.' },
                    { id: 'vampiricTouch', name: 'Vampiric Touch', level: 3, cost: 30, description: 'Damage dealt returns to you as health.' },
                    { id: 'blight', name: 'Blight', level: 4, cost: 40, description: 'Draw the life out of a living thing.' },
                ] },
                { id: 'transmutation', name: 'Transmutation', spells: [
                    { id: 'featherFall', name: 'Feather Fall', level: 1, cost: 5, description: 'Slow the fall of up to five creatures.' },
                    { id: 'haste', name: 'Haste', level: 3, cost: 30, description: "Double a creature's speed and grant an extra action." },
                    { id: 'enlargeReduce', name: 'Enlarge/Reduce', level: 2, cost: 20, description: 'Grow or shrink a creature or object.' },
                    { id: 'stoneskin', name: 'Stoneskin', level: 4, cost: 40, description: 'Flesh hardens against blades and blunt force.' },
                    { id: 'polymorph', name: 'Polymorph', level: 4, cost: 45, description: 'Change a creature into another shape entirely.' },
                ] },
            ],

            // The kinds of thing an item can be. A slot's badge and the gear
            // slots it fits both read from here.
            itemSlots: [
                { id: 'head', label: 'Head' },
                { id: 'hand', label: 'Hand' },
                { id: 'legs', label: 'Legs' },
                { id: 'accessory', label: 'Accessory' },
                { id: 'consumable', label: 'Consumable' },
            ],

            // What the character is wearing. accepts names the kind of item
            // the slot takes; equipped holds an inventory item's id, or '' for
            // empty. The options come from the inventory, so you can only put
            // on something you are actually carrying.
            gearSlots: [
                { id: 'gearHead', label: 'Head', accepts: 'head', equipped: '' },
                { id: 'gearLeftHand', label: 'L. Hand', accepts: 'hand', equipped: '' },
                { id: 'gearRightHand', label: 'R. Hand', accepts: 'hand', equipped: '' },
                { id: 'gearLegs', label: 'Legs', accepts: 'legs', equipped: '' },
                { id: 'gearAccessory1', label: 'Accessory 1', accepts: 'accessory', equipped: '' },
                { id: 'gearAccessory2', label: 'Accessory 2', accepts: 'accessory', equipped: '' },
            ],

            // How many of one item may stack.
            itemQtyRange: { min: 1, max: 99 },

            // What the character is carrying.
            inventory: [],

            // Where the roster lives. One array of characters under one key,
            // written by the forge and read by view-characters.html.
            storageKey: 'theForgeCharacters',

            // Remembers that the sample characters have been added, so they
            // are added once and stay deleted if you delete them.
            seedFlagKey: 'theForgeSamplesAdded',

            // The id of the roster entry being edited, or '' when building a new
            // character. Uniqueness checks ignore this one, so editing a
            // character does not report it as clashing with itself.
            editingId: '',

            // Paging. Four per page, so ten samples fill three pages.
            rosterPage: 1,
            rosterPageSize: 4,

            // --- The roster page ---
            // Saved characters, loaded from storage on mount. Empty on the
            // forge page, which simply never renders it.
            roster: [],

            // Which field the search box looks at, and what it is looking for.
            rosterSearchField: 'name',
            rosterSearchTerm: '',
            rosterTypeFilter: 'all',

            // Characters pinned to the top so they stay on screen while you
            // search for another. Ids, not objects — the roster array is
            // rebuilt from storage and object identity would not survive it.
            lockedIds: [],

            rosterSearchFields: [
                { id: 'name', label: 'Name' },
                { id: 'id', label: 'ID' },
            ],

            rosterTypeFilters: [
                { id: 'all', label: 'All' },
                { id: 'player', label: 'Players' },
                { id: 'npc', label: 'NPCs' },
            ],

            // Sort order, as buttons rather than a dropdown so the current
            // order is readable without opening anything.
            rosterSort: 'name',
            rosterSorts: [
                { id: 'name', label: 'Name' },
                { id: 'level', label: 'Level' },
                { id: 'id', label: 'ID' },
            ],

            // The character the delete modal is asking about. One modal
            // serves every row, so it has to be told which one.
            pendingDelete: null,

            // Sample characters, written as the little that makes each one
            // different. buildSampleCharacter expands a spec into a full
            // character using the same catalogs the forge does, so a sample
            // cannot describe a skill or item that does not exist.
            sampleRoster: [
                {
                    id: 'U-88', name: 'Thorin Ironfist', type: 'player', level: 12,
                    stats: { strength: 16, dexterity: 9, constitution: 14, intelligence: 7, wisdom: 8, charisma: 6 },
                    skills: { gathering: { mining: 62, lumberjacking: 40 }, oneHandedWeapons: { axe: 71 }, mediumArmor: { chainmail: 55 } },
                    abilities: ['richVeins', 'cleave'], feats: ['toughness', 'ironWill'],
                    spells: {}, learned: [],
                    items: { ironHelm: 1, handAxe: 1, chainmailLeggings: 1, healthPotion: 3 },
                    gear: { gearHead: 'ironHelm', gearRightHand: 'handAxe', gearLegs: 'chainmailLeggings' },
                },
                {
                    id: 'U-91', name: 'Lyra Dawnsong', type: 'player', level: 8,
                    stats: { strength: 6, dexterity: 12, constitution: 8, intelligence: 14, wisdom: 11, charisma: 17 },
                    skills: { magic: {}, oneHandedWeapons: { dagger: 33 } },
                    abilities: [], feats: ['arcaneGift'],
                    spells: { illusion: ['minorIllusion', 'disguiseSelf'], enchantment: ['charmPerson'] },
                    learned: ['minorIllusion', 'disguiseSelf', 'charmPerson'],
                    items: { dagger: 1, leatherHood: 1, manaPotion: 2 },
                    gear: { gearHead: 'leatherHood', gearLeftHand: 'dagger' },
                },
                {
                    id: 'U-104', name: 'Bran Oakenshield', type: 'player', level: 15,
                    stats: { strength: 15, dexterity: 8, constitution: 18, intelligence: 6, wisdom: 10, charisma: 9 },
                    skills: { mediumArmor: { chainmail: 80, brigandine: 45 }, oneHandedWeapons: { mace: 58 } },
                    abilities: ['linkedRings', 'deflect'], feats: ['toughness'],
                    spells: {}, learned: [],
                    items: { woodenShield: 1, chainmailLeggings: 1, healthPotion: 5 },
                    gear: { gearLeftHand: 'woodenShield', gearLegs: 'chainmailLeggings' },
                },
                {
                    id: 'U-112', name: 'Mira Quickfoot', type: 'player', level: 6,
                    stats: { strength: 7, dexterity: 17, constitution: 9, intelligence: 11, wisdom: 12, charisma: 10 },
                    skills: { oneHandedWeapons: { dagger: 64 }, lightArmor: {}, gathering: { foraging: 28 } },
                    abilities: ['backstab'], feats: [],
                    spells: {}, learned: [],
                    items: { dagger: 1, leatherHood: 1, rope: 1, bread: 4 },
                    gear: { gearLeftHand: 'dagger', gearHead: 'leatherHood' },
                },
                {
                    id: 'U-127', name: 'Sable Vex', type: 'player', level: 20,
                    stats: { strength: 5, dexterity: 10, constitution: 11, intelligence: 19, wisdom: 15, charisma: 13 },
                    skills: { magic: {} },
                    abilities: [], feats: ['arcaneGift', 'abilityPoints2'],
                    spells: { necromancy: ['chillTouch', 'animateDead', 'vampiricTouch'], abjuration: ['dispelMagic'] },
                    learned: ['chillTouch', 'animateDead', 'vampiricTouch', 'dispelMagic'],
                    items: { manaPotion: 6, amuletOfWarding: 1 },
                    gear: { gearAccessory1: 'amuletOfWarding' },
                },
                {
                    id: 'NPC-07', name: 'Grenda the Grey', type: 'npc', level: 5,
                    stats: { strength: 6, dexterity: 8, constitution: 9, intelligence: 12, wisdom: 16, charisma: 11 },
                    skills: { gathering: { foraging: 74, mining: 12 } },
                    abilities: ['keenEye'], feats: [],
                    spells: { divination: ['detectMagic'] }, learned: ['detectMagic'],
                    items: { bread: 2, antidote: 1 },
                    gear: {},
                },
                {
                    id: 'NPC-12', name: 'Harrow Blackwood', type: 'npc', level: 18,
                    stats: { strength: 8, dexterity: 11, constitution: 12, intelligence: 18, wisdom: 14, charisma: 15 },
                    skills: { magic: {}, oneHandedWeapons: { rapier: 41 } },
                    abilities: [], feats: ['arcaneGift'],
                    spells: { evocation: ['magicMissile', 'fireball', 'lightningBolt'] },
                    learned: ['magicMissile', 'fireball', 'lightningBolt'],
                    items: { manaPotion: 4, ringOfVigor: 1 },
                    gear: { gearAccessory1: 'ringOfVigor' },
                },
                {
                    id: 'NPC-19', name: 'Tessa Mudlark', type: 'npc', level: 3,
                    stats: { strength: 5, dexterity: 9, constitution: 7, intelligence: 8, wisdom: 10, charisma: 12 },
                    skills: { gathering: { foraging: 21, fishing: 35 } },
                    abilities: [], feats: [],
                    spells: {}, learned: [],
                    items: { bread: 3, rope: 1 },
                    gear: {},
                },
                {
                    id: 'NPC-23', name: 'Korrin Stonejaw', type: 'npc', level: 25,
                    stats: { strength: 20, dexterity: 12, constitution: 19, intelligence: 7, wisdom: 9, charisma: 8 },
                    skills: { twoHandedWeapons: {}, heavyArmor: {}, oneHandedWeapons: { axe: 88, mace: 70 } },
                    abilities: ['cleave', 'rend', 'crushingBlow'], feats: ['toughness', 'ironWill', 'quickDraw'],
                    spells: {}, learned: [],
                    items: { handAxe: 1, ironHelm: 1, healthPotion: 8 },
                    gear: { gearHead: 'ironHelm', gearRightHand: 'handAxe' },
                },
                {
                    id: 'NPC-31', name: 'Wisp', type: 'npc', level: 1,
                    stats: {}, skills: {}, abilities: [], feats: [],
                    spells: {}, learned: [], items: {}, gear: {},
                },
                // Same User ID as Thorin on purpose — one player, several
                // characters. Only the names have to differ.
                {
                    id: 'U-88', name: 'Dain Emberhand', type: 'player', level: 9,
                    stats: { strength: 13, dexterity: 10, constitution: 12, intelligence: 9, wisdom: 8, charisma: 7 },
                    skills: { gathering: { mining: 48, lumberjacking: 31 }, oneHandedWeapons: { mace: 44 } },
                    abilities: ['richVeins'], feats: ['toughness'],
                    spells: {}, learned: [],
                    items: { ironHelm: 1, healthPotion: 2 },
                    gear: { gearHead: 'ironHelm' },
                },
                {
                    id: 'U-91', name: 'Nessa Dawnsong', type: 'player', level: 7,
                    stats: { strength: 6, dexterity: 13, constitution: 8, intelligence: 13, wisdom: 12, charisma: 15 },
                    skills: { oneHandedWeapons: { dagger: 29 }, magic: {} },
                    abilities: [], feats: [],
                    spells: { enchantment: ['sleep', 'charmPerson'] },
                    learned: ['sleep', 'charmPerson'],
                    items: { dagger: 1, manaPotion: 3 },
                    gear: { gearLeftHand: 'dagger' },
                },
                {
                    id: 'NPC-44', name: 'Old Crow', type: 'npc', level: 14,
                    stats: { strength: 7, dexterity: 10, constitution: 10, intelligence: 16, wisdom: 17, charisma: 9 },
                    skills: { gathering: { herbalism: 66 }, magic: {} },
                    abilities: [], feats: ['arcaneGift'],
                    spells: { divination: ['detectMagic', 'trueSeeing'], necromancy: ['falseLife'] },
                    learned: ['detectMagic', 'trueSeeing', 'falseLife'],
                    items: { antidote: 2, torch: 1, bread: 1 },
                    gear: {},
                },
                {
                    id: 'NPC-52', name: 'Ser Gallant', type: 'npc', level: 22,
                    stats: { strength: 18, dexterity: 11, constitution: 17, intelligence: 9, wisdom: 11, charisma: 14 },
                    skills: { heavyArmor: {}, oneHandedWeapons: { sword: 79 }, mediumArmor: { brigandine: 52 } },
                    abilities: ['riposte', 'rivetedGuard'], feats: ['ironWill', 'quickDraw'],
                    spells: {}, learned: [],
                    items: { woodenShield: 1, healthPotion: 4, ringOfVigor: 1 },
                    gear: { gearLeftHand: 'woodenShield', gearAccessory1: 'ringOfVigor' },
                },
            ],

            // Everything that exists to pick up. The ones not already carried
            // came from the add menu; their descriptions are placeholders.
            itemCatalog: [
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
            ],
        };
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        // How far along its track a slider is, as a percentage. forge.scss
        // paints the filled part of the track from --range-fill.
        fillPercent: function (stat) {
            const span = stat.max - stat.min;
            const filled = span === 0 ? 0 : (stat.value - stat.min) / span * 100;

            return Math.round(filled) + '%';
        },
        // The highest this stat can reach right now: its own ceiling, or
        // whatever the remaining pool can pay for, whichever comes first.
        affordableMax: function (stat) {
            return Math.min(stat.max, stat.value + this.statPointsLeft);
        },

        // Runs on every drag. Refuses any value the pool cannot pay for.
        setStatValue: function (stat, event) {
            const wanted = Number(event.target.value);
            const allowed = Math.min(wanted, this.affordableMax(stat));

            stat.value = allowed;

            // The thumb may have been dragged past what we allowed. If the
            // value did not change, Vue has nothing to patch and the thumb
            // would stay where the mouse left it, so put it back by hand.
            event.target.value = allowed;
        },
        // Where a tracker dot sits along the bar, as a percentage. Six dots
        // works out to 0, 20, 40, 60, 80, 100 — which is what the hand-written
        // start-0 / start-20 / ... classes were doing.
        dotLeft: function (index) {
            return (index / (this.steps.length - 1)) * 100 + '%';
        },

        // Each step's Save button submits the form. The browser has already
        // checked required fields by the time this runs, so just move on.
        // On the last step, ask for confirmation instead.
        // Each step's Save button submits the form. The browser has already
        // checked required fields by the time this runs. An overspent stat
        // pool is the one thing the browser cannot check for us.
        nextStep: function () {
            if (this.statPointsLeft < 0) {
                this.message.kind = 'alert-danger';
                this.message.text = 'You are ' + Math.abs(this.statPointsLeft)
                    + ' stat points over budget. Lower a stat before moving on.';

                return;
            }

            this.message.text = '';

            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.scrollToStep();
            } else {
                bootstrap.Modal
                    .getOrCreateInstance(document.getElementById('confirmSaveModal'))
                    .show();
            }
        },

        goBack: function () {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.scrollToStep();
            }
        },

        // Jump straight to a step from the tracker. Step one is always
        // reachable; the rest wait for the same condition that ungreys the
        // first Save button, so you cannot skip past naming the character.
        stepDisabled: function (index) {
            return index > 0 && !this.infoComplete;
        },

        goToStep: function (index) {
            if (this.stepDisabled(index)) {
                return;
            }

            this.currentStep = index;
            this.scrollToStep();
        },

        // v-show only toggles display, so the tracker never moves. Scrolling
        // to it puts the new step at the top of the view instead of leaving
        // the page parked down at the Vitals card.
        scrollToStep: function () {
            document.querySelector('.step-tracker')
                .scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Bootstrap builds a tooltip per element rather than listening on the
        // document the way dropdowns and modals do, so anything Vue re-renders
        // loses its tooltip. getOrCreateInstance means re-running this is safe.
        startTooltips: function () {
            const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');

            for (const trigger of triggers) {
                bootstrap.Tooltip.getOrCreateInstance(trigger);
            }
        },

        // Confirming the save. A real save would send the character to a
        // server first; for now it reports it and starts a fresh one.
        saveCharacter: function () {
            const savedName = this.character.name;
            const savedId = this.activeId;

            this.storeCharacter();
            this.loadRoster();
            this.editingId = '';

            // Assigning the data back to its starting values is the whole
            // reset. Every field, slider and badge follows on its own.
            this.character = { name: '', type: 'player', userId: '', npcId: '' };

            for (const stat of this.stats) {
                stat.value = stat.min;
            }

            this.currentStep = 0;

            this.message.kind = 'alert-success';
            this.message.text = 'Character "' + savedName + '" (' + savedId
                + ') saved to the roster. Starting a new character.';
        },

        // --- Saving and loading -------------------------------------------
        //
        // Two pages means two Vue apps with no memory of each other, so the
        // roster and the forge talk through localStorage: one array of
        // characters under one key.
        //
        // The forge's state is spread across a dozen top-level keys rather
        // than living in a single character object. Rather than restructure
        // every binding, these two methods gather it up on the way out and
        // spread it back on the way in. The shape you edit and the shape you
        // store do not have to be the same.

        // The key a character is stored and linked under. It has to be unique,
        // and the obvious choice — the ID you typed — is not: one player may
        // have several characters under one User ID. NPC IDs are unique by
        // rule, and player names are, so a player's key is their ID and their
        // name together.
        characterKey: function (type, userId, npcId, name) {
            return type === 'npc'
                ? String(npcId).trim()
                : String(userId).trim() + ' / ' + String(name).trim();
        },

        // The ID to show on a roster card: the one that was typed, not the key.
        characterIdLabel: function (character) {
            return character.type === 'npc'
                ? character.npcId || character.id
                : character.userId || character.id;
        },

        // Everything worth keeping, as one object.
        collectCharacter: function () {
            const snapshot = {
                id: this.characterKey(
                    this.character.type,
                    this.character.userId,
                    this.character.npcId,
                    this.character.name
                ),
                name: this.character.name,
                type: this.character.type,
                userId: this.character.userId,
                npcId: this.character.npcId,
                vitals: this.vitals,
                stats: this.stats,
                skillCategories: this.skillCategories,
                learnedAbilities: this.learnedAbilities,
                feats: this.feats,
                featAllowance: this.featAllowance,
                spellSchools: this.spellSchools,
                learnedSpells: this.learnedSpells,
                gearSlots: this.gearSlots,
                inventory: this.inventory,
                savedAt: new Date().toISOString(),
            };

            // Round-tripping through JSON is a deep copy. Without it the
            // stored character would share objects with the live form and
            // keep changing after it was saved.
            return JSON.parse(JSON.stringify(snapshot));
        },

        // Spread a saved character back across the form. Each field is copied
        // only if the saved object has it, so a character saved before a
        // feature existed still loads instead of blanking the page.
        applyCharacter: function (saved) {
            const copy = JSON.parse(JSON.stringify(saved));

            this.character = {
                name: copy.name || '',
                type: copy.type || 'player',
                userId: copy.userId || '',
                npcId: copy.npcId || '',
            };

            const fields = [
                'vitals', 'stats', 'skillCategories', 'learnedAbilities',
                'feats', 'featAllowance', 'spellSchools', 'learnedSpells',
                'gearSlots', 'inventory',
            ];

            for (const field of fields) {
                if (copy[field] !== undefined) {
                    this[field] = copy[field];
                }
            }

            this.currentStep = 0;
        },

        // localStorage can throw — a private window, a full quota, or someone
        // editing it by hand. Losing the roster beats the page refusing to
        // load, so both of these fail quietly and say so in the console.
        readCharacters: function () {
            try {
                const raw = window.localStorage.getItem(this.storageKey);

                return raw === null ? [] : JSON.parse(raw);
            } catch (error) {
                console.warn('Could not read saved characters:', error);

                return [];
            }
        },

        writeCharacters: function (characters) {
            try {
                window.localStorage.setItem(this.storageKey, JSON.stringify(characters));
            } catch (error) {
                console.warn('Could not save characters:', error);
            }
        },

        // Save under the character's ID. Same ID means this is an edit of a
        // character already on the roster, so it replaces rather than adds —
        // which is what makes the round trip a round trip.
        storeCharacter: function () {
            const saved = this.collectCharacter();
            const characters = this.readCharacters();
            const index = characters.findIndex((entry) => entry.id === saved.id);

            if (index === -1) {
                characters.push(saved);
            } else {
                characters[index] = saved;
            }

            this.writeCharacters(characters);
        },

        // --- The roster page ---------------------------------------------
        //
        // These read a SAVED character rather than the live form, so every
        // one takes the character as an argument. A saved character may have
        // been written before a feature existed, so each falls back to
        // something empty rather than assuming a field is there.

        loadRoster: function () {
            this.roster = this.readCharacters();
        },

        // Expand a sample spec into a full character, pulling names and
        // descriptions out of the same catalogs the forge uses. A sample can
        // therefore never mention a skill, spell or item that does not exist.
        buildSampleCharacter: function (spec) {
            const stats = spec.stats || {};
            const constitution = stats.constitution === undefined ? 1 : stats.constitution;
            const wisdom = stats.wisdom === undefined ? 1 : stats.wisdom;
            const dexterity = stats.dexterity === undefined ? 1 : stats.dexterity;

            const userId = spec.type === 'npc' ? '' : spec.id;
            const npcId = spec.type === 'npc' ? spec.id : '';

            const character = {
                id: this.characterKey(spec.type, userId, npcId, spec.name),
                name: spec.name,
                type: spec.type,
                userId: userId,
                npcId: npcId,
                vitals: {
                    level: spec.level,
                    hp: this.maxHpFor(constitution, spec.level),
                    mp: this.maxMpFor(wisdom, spec.level),
                    sp: this.maxSpFor(dexterity, constitution, spec.level),
                },
                stats: this.stats.map((stat) => ({
                    id: stat.id,
                    label: stat.label,
                    min: stat.min,
                    max: stat.max,
                    value: stats[stat.id] === undefined ? stat.min : stats[stat.id],
                    description: stat.description,
                })),
                skillCategories: [],
                learnedAbilities: (spec.abilities || []).slice(),
                feats: [],
                featAllowance: Math.floor(spec.level / this.featsPerLevel),
                spellSchools: [],
                learnedSpells: (spec.learned || []).slice(),
                gearSlots: this.gearSlots.map((slot) => ({
                    id: slot.id,
                    label: slot.label,
                    accepts: slot.accepts,
                    equipped: (spec.gear || {})[slot.id] || '',
                })),
                inventory: [],
                savedAt: new Date().toISOString(),
            };

            for (const categoryId of Object.keys(spec.skills || {})) {
                const source = this.skillCatalog.find((entry) => entry.id === categoryId);

                if (source === undefined) {
                    continue;
                }

                const wanted = spec.skills[categoryId];

                character.skillCategories.push({
                    id: source.id,
                    name: source.name,
                    skills: Object.keys(wanted)
                        .map((skillId) => source.skills.find((entry) => entry.id === skillId))
                        .filter((found) => found !== undefined)
                        .map((found) => ({
                            id: found.id,
                            name: found.name,
                            description: found.description,
                            min: this.skillRange.min,
                            max: this.skillRange.max,
                            value: wanted[found.id],
                        })),
                });
            }

            for (const featId of spec.feats || []) {
                const found = this.featCatalog.find((entry) => entry.id === featId);

                if (found !== undefined) {
                    character.feats.push({
                        id: found.id,
                        name: found.name,
                        kind: found.kind,
                        source: 'earned',
                        description: found.description,
                    });
                }
            }

            // Every school, holding only the spells this character carries.
            for (const source of this.spellCatalog) {
                const wanted = (spec.spells || {})[source.id] || [];

                character.spellSchools.push({
                    id: source.id,
                    name: source.name,
                    spells: source.spells
                        .filter((spell) => wanted.includes(spell.id))
                        .map((spell) => ({
                            id: spell.id,
                            name: spell.name,
                            level: spell.level,
                            cost: spell.cost,
                            description: spell.description,
                        })),
                });
            }

            for (const itemId of Object.keys(spec.items || {})) {
                const found = this.itemCatalog.find((entry) => entry.id === itemId);

                if (found !== undefined) {
                    character.inventory.push({
                        id: found.id,
                        name: found.name,
                        slot: found.slot,
                        qty: spec.items[itemId],
                        description: found.description,
                    });
                }
            }

            return character;
        },

        // Add the sample characters once per browser, keeping anything already
        // saved. A separate flag rather than "is storage empty?" — someone who
        // has built characters of their own still deserves the samples, and
        // someone who deletes a sample should not see it come back on reload.
        seedRoster: function () {
            try {
                if (window.localStorage.getItem(this.seedFlagKey) !== null) {
                    return;
                }
            } catch (error) {
                return;
            }

            const characters = this.readCharacters();
            const existing = characters.map((entry) => entry.id);

            for (const spec of this.sampleRoster) {
                const key = this.characterKey(
                    spec.type,
                    spec.type === 'npc' ? '' : spec.id,
                    spec.type === 'npc' ? spec.id : '',
                    spec.name
                );

                if (!existing.includes(key)) {
                    characters.push(this.buildSampleCharacter(spec));
                }
            }

            this.writeCharacters(characters);

            try {
                window.localStorage.setItem(this.seedFlagKey, 'done');
            } catch (error) {
                console.warn('Could not record that samples were added:', error);
            }
        },

        goToPage: function (page) {
            this.rosterPage = Math.min(Math.max(page, 1), this.rosterPageCount);
        },

        // Save one character to a file. There is no "write this string to
        // disk" API, so the standard move is a Blob, a temporary URL pointing
        // at it, and a link clicked in code. revokeObjectURL hands the memory
        // back once the download has started.
        downloadCharacter: function (character) {
            const blob = new Blob([JSON.stringify(character, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = character.name.replace(/[^a-zA-Z0-9_-]+/g, '-') + '.json';
            link.click();

            URL.revokeObjectURL(url);
        },

        // Where this character's Edit button goes. encodeURIComponent keeps
        // an id with a space or a slash in it from breaking the query string.
        editHref: function (character) {
            return 'creation-character.html?id=' + encodeURIComponent(character.id);
        },

        characterTypeLabel: function (character) {
            return character.type === 'npc' ? 'NPC' : 'Player';
        },

        characterTypeClass: function (character) {
            return character.type === 'npc' ? 'bg-secondary text-dark' : 'bg-primary';
        },

        characterLevel: function (character) {
            return character.vitals === undefined ? 1 : character.vitals.level;
        },

        // One saved character's attribute value, by id.
        savedStatValue: function (character, id) {
            const stat = (character.stats || []).find((entry) => entry.id === id);

            return stat === undefined ? 0 : stat.value;
        },

        // HP / MP / SP for a saved character, each as current out of its
        // ceiling. The ceilings come from the same three methods the forge
        // uses, so a roster card and the forge always agree. The colours are
        // Bootstrap's, generated from the $forge-colors map in forge.scss.
        characterVitals: function (character) {
            const vitals = character.vitals || {};
            const level = this.characterLevel(character);
            const constitution = this.savedStatValue(character, 'constitution');

            return [
                {
                    id: 'hp',
                    label: 'HP',
                    badgeClass: 'text-bg-health',
                    value: vitals.hp === undefined ? 0 : vitals.hp,
                    max: this.maxHpFor(constitution, level),
                },
                {
                    id: 'mp',
                    label: 'MP',
                    badgeClass: 'text-bg-mana',
                    value: vitals.mp === undefined ? 0 : vitals.mp,
                    max: this.maxMpFor(this.savedStatValue(character, 'wisdom'), level),
                },
                {
                    id: 'sp',
                    label: 'SP',
                    badgeClass: 'text-bg-stamina',
                    value: vitals.sp === undefined ? 0 : vitals.sp,
                    max: this.maxSpFor(
                        this.savedStatValue(character, 'dexterity'),
                        constitution,
                        level
                    ),
                },
            ];
        },

        characterStats: function (character) {
            return character.stats || [];
        },

        characterSkillCategories: function (character) {
            return character.skillCategories || [];
        },

        // Learned abilities, looked up in the catalog so the sheet shows
        // names rather than the ids that were stored.
        characterAbilities: function (character) {
            const learned = character.learnedAbilities || [];
            const names = [];

            for (const entry of this.abilityCatalog) {
                for (const ability of entry.abilities) {
                    if (learned.includes(ability.id)) {
                        names.push(ability);
                    }
                }
            }

            return names;
        },

        characterFeats: function (character) {
            return character.feats || [];
        },

        // Learned spells, found in the character's own schools so a spell
        // keeps whatever level and cost it was saved with.
        characterSpells: function (character) {
            const learned = character.learnedSpells || [];
            const found = [];

            for (const school of character.spellSchools || []) {
                for (const spell of school.spells) {
                    if (learned.includes(spell.id)) {
                        found.push(spell);
                    }
                }
            }

            return found;
        },

        // Gear slots with the equipped item resolved to its name.
        characterGear: function (character) {
            const inventory = character.inventory || [];

            return (character.gearSlots || []).map((slot) => {
                const item = inventory.find((entry) => entry.id === slot.equipped);

                return {
                    id: slot.id,
                    label: slot.label,
                    itemName: item === undefined ? 'Empty' : item.name,
                    filled: item !== undefined,
                };
            });
        },

        characterInventory: function (character) {
            return character.inventory || [];
        },

        // Each sheet needs its own collapse id.
        sheetPanelId: function (character) {
            return 'sheet-' + character.id.replace(/[^a-zA-Z0-9_-]/g, '-');
        },

        sheetPanelTarget: function (character) {
            return '#' + this.sheetPanelId(character);
        },

        isLocked: function (character) {
            return this.lockedIds.includes(character.id);
        },

        toggleLock: function (character) {
            const index = this.lockedIds.indexOf(character.id);

            if (index === -1) {
                this.lockedIds.push(character.id);
            } else {
                this.lockedIds.splice(index, 1);
            }
        },

        lockLabel: function (character) {
            return this.isLocked(character)
                ? 'Release ' + character.name
                : 'Lock ' + character.name + ' for comparison';
        },

        lockMenuLabel: function (character) {
            return this.isLocked(character) ? 'Release lock' : 'Lock for comparison';
        },

        lockMenuIcon: function (character) {
            return this.isLocked(character) ? 'bi bi-unlock me-2' : 'bi bi-lock me-2';
        },

        // A locked card is outlined so it reads as pinned rather than as just
        // the first result.
        rosterCardClass: function (character) {
            return this.isLocked(character) ? 'border-primary border-2' : '';
        },

        // The kebab points the shared modal at one character; the modal's
        // button then deletes whatever it is pointing at.
        askDelete: function (character) {
            this.pendingDelete = character;
        },

        confirmDelete: function () {
            if (this.pendingDelete !== null) {
                this.deleteCharacter(this.pendingDelete);
                this.pendingDelete = null;
            }
        },

        // Delete writes the shortened list straight back to storage, so the
        // roster and what is stored cannot disagree.
        deleteCharacter: function (character) {
            const kept = this.readCharacters().filter((entry) => entry.id !== character.id);

            this.writeCharacters(kept);
            this.loadRoster();

            const locked = this.lockedIds.indexOf(character.id);

            if (locked !== -1) {
                this.lockedIds.splice(locked, 1);
            }
        },

        // The roster links here as creation-character.html?id=U-88. If that
        // id is on the page, load that character instead of starting blank.
        loadFromQuery: function () {
            const wanted = new URLSearchParams(window.location.search).get('id');

            if (wanted === null) {
                return;
            }

            const found = this.readCharacters().find((entry) => entry.id === wanted);

            if (found === undefined) {
                this.message.kind = 'alert-danger';
                this.message.text = 'No saved character with ID ' + wanted + '.';

                return;
            }

            this.applyCharacter(found);
            this.editingId = found.id;

            this.message.kind = 'alert-success';
            this.message.text = 'Editing "' + found.name + '" (' + found.id
                + '). Saving will update the roster entry.';
        },
        // "Step 3, Skills" — what a screen reader announces for a dot.
        dotLabel: function (step, index) {
            return 'Step ' + (index + 1) + ', ' + step.label;
        },
        // The three equations, written once. The forge asks with the live
        // form's numbers and the roster asks with a saved character's, so
        // neither page can drift from the other.
        //
        //   HP = Constitution * 3 + Level * 2
        //   MP = Wisdom * 2 + Level
        //   SP = Dexterity * 2 + Constitution + Level
        maxHpFor: function (constitution, level) {
            return constitution * 3 + level * 2;
        },

        maxMpFor: function (wisdom, level) {
            return wisdom * 2 + level;
        },

        maxSpFor: function (dexterity, constitution, level) {
            return dexterity * 2 + constitution + level;
        },

        // Look up one attribute's current value by id. find() walks the array
        // and returns the first entry the test says true for, or undefined if
        // there is none — hence the guard.
        statValue: function (id) {
            const stat = this.stats.find((entry) => entry.id === id);

            return stat === undefined ? 0 : stat.value;
        },

        // Runs on every drag of an HP/MP/SP slider. The ceiling is derived, so
        // it can move underneath the value; refuse anything above it. Same
        // manual write-back as setStatValue, for the same reason.
        setVital: function (bar, event) {
            const allowed = Math.min(Number(event.target.value), bar.max);

            this.vitals[bar.id] = allowed;
            event.target.value = allowed;
        },

        // Bootstrap marks a closed modal aria-hidden while the button that
        // dismissed it still holds focus, and Chrome rightly objects to hiding
        // a focused element from assistive technology. Handing focus back to
        // the page just before the modal hides clears the warning.
        // Bound once from mounted, never from updated - that would stack up a
        // fresh listener on every re-render.
        releaseModalFocus: function () {
            for (const modal of document.querySelectorAll('.modal')) {
                modal.addEventListener('hide.bs.modal', function () {
                    if (modal.contains(document.activeElement)) {
                        document.activeElement.blur();
                    }
                });
            }
        },

        // Pull every current value back under its ceiling. Called on load and
        // whenever a maximum moves.
        clampVitals: function () {
            this.vitals.hp = Math.min(this.vitals.hp, this.maxHp);
            this.vitals.mp = Math.min(this.vitals.mp, this.maxMp);
            this.vitals.sp = Math.min(this.vitals.sp, this.maxSp);
        },
        // Remove one skill from one category. splice needs a position, so find
        // it first. indexOf works on objects because it compares identity —
        // this is the same object that is in the array, not a copy of it.
        removeSkill: function (category, skill) {
            const index = category.skills.indexOf(skill);

            if (index !== -1) {
                category.skills.splice(index, 1);
            }
        },

        // Remove a whole category, skills and all.
        removeCategory: function (category) {
            const index = this.skillCategories.indexOf(category);

            if (index !== -1) {
                this.skillCategories.splice(index, 1);
            }
        },

        // Build the character's copy of a catalog skill. Copying field by
        // field rather than pushing the catalog object itself matters: push
        // the original and every character who learns Mining shares one
        // object, so raising it on one raises it on all of them.
        addSkill: function (category, catalogSkill) {
            category.skills.push({
                id: catalogSkill.id,
                name: catalogSkill.name,
                description: catalogSkill.description,
                min: this.skillRange.min,
                max: this.skillRange.max,
                value: this.skillRange.min,
            });
        },

        addCategory: function (catalogCategory) {
            this.skillCategories.push({
                id: catalogCategory.id,
                name: catalogCategory.name,
                skills: [],
            });
        },

        // Which skills this category could still add. It takes an argument, so
        // it has to be a method — there is nothing to cache when the answer
        // depends on which category you ask about. some() answers "is there at
        // least one that matches?" without caring which one.
        availableSkills: function (category) {
            const source = this.skillCatalog.find((entry) => entry.id === category.id);

            if (source === undefined) {
                return [];
            }

            return source.skills.filter((skill) => {
                return !category.skills.some((owned) => owned.id === skill.id);
            });
        },

        // Bootstrap needs a unique id per accordion panel, and the button that
        // opens it needs that id with a # in front. Both are strings built
        // from data, so both are methods rather than expressions in markup.
        panelId: function (category) {
            return 'skill-panel-' + category.id;
        },

        panelTarget: function (category) {
            return '#' + this.panelId(category);
        },

        actionsLabel: function (name) {
            return 'Actions for ' + name;
        },
        // Which effects of this kind are not already on the character.
        availableEffects: function (kind) {
            return this.effectCatalog.filter((entry) => {
                return entry.kind === kind
                    && !this.effects.some((owned) => owned.id === entry.id);
            });
        },

        // Copy the catalog entry rather than pushing it, for the same reason
        // addSkill does — otherwise every character shares one object.
        addEffect: function (catalogEffect) {
            this.effects.push({
                id: catalogEffect.id,
                name: catalogEffect.name,
                kind: catalogEffect.kind,
                duration: catalogEffect.duration,
                description: catalogEffect.description,
            });
        },

        removeEffect: function (effect) {
            const index = this.effects.indexOf(effect);

            if (index !== -1) {
                this.effects.splice(index, 1);
            }

        },
        // Feats of one kind the character does not already have.
        availableFeats: function (kind) {
            return this.featCatalog.filter((entry) => {
                return entry.kind === kind
                    && !this.feats.some((owned) => owned.id === entry.id);
            });
        },

        // Level-earned slots fill before granted ones, so a new feat is
        // "Earned" while the levels still cover it and "Bonus" after.
        addFeat: function (catalogFeat) {
            const earnedTaken = this.feats.filter((feat) => feat.source === 'earned').length;

            this.feats.push({
                id: catalogFeat.id,
                name: catalogFeat.name,
                kind: catalogFeat.kind,
                source: earnedTaken < this.featsEarned ? 'earned' : 'bonus',
                description: catalogFeat.description,
            });
        },

        removeFeat: function (feat) {
            const index = this.feats.indexOf(feat);

            if (index !== -1) {
                this.feats.splice(index, 1);
            }
        },

        // The two badges on a feat row. Looking the descriptor up here keeps
        // the markup naming things instead of indexing into arrays.
        featKindBadge: function (feat) {
            return this.featKinds.find((entry) => entry.id === feat.kind);
        },

        featSourceBadge: function (feat) {
            return this.featSources.find((entry) => entry.id === feat.source);
        },
        // The abilities a skill offers, from the catalog.
        abilitiesFor: function (skill) {
            const entry = this.abilityCatalog.find((item) => item.skillId === skill.id);

            return entry === undefined ? [] : entry.abilities;
        },

        isLearned: function (ability) {
            return this.learnedAbilities.includes(ability.id);
        },

        // A stat's display name, for requirement text.
        statLabel: function (id) {
            const stat = this.stats.find((entry) => entry.id === id);

            return stat === undefined ? id : stat.label;
        },

        // Which requirements are not met yet, in words. An empty array means
        // the ability is available. Each part of requires is optional, so
        // each is checked only if it is there.
        abilityBlockers: function (skill, ability) {
            const blockers = [];
            const needs = ability.requires;

            if (needs === undefined) {
                return blockers;
            }

            if (needs.skill !== undefined && skill.value < needs.skill) {
                blockers.push(skill.name + ' ' + needs.skill);
            }

            if (needs.stat !== undefined && this.statValue(needs.stat.id) < needs.stat.value) {
                blockers.push(this.statLabel(needs.stat.id) + ' ' + needs.stat.value);
            }

            if (needs.level !== undefined && this.vitals.level < needs.level) {
                blockers.push('Level ' + needs.level);
            }

            return blockers;
        },

        canLearn: function (skill, ability) {
            return this.abilityBlockers(skill, ability).length === 0;
        },

        // The toggle's tooltip: what it does once learned, or what is missing.
        abilityTitle: function (skill, ability) {
            const blockers = this.abilityBlockers(skill, ability);

            if (blockers.length === 0) {
                return ability.description;
            }

            return 'Needs ' + blockers.join(', ');
        },

        // Learn or unlearn. Unlearning is always allowed — only learning is
        // gated, so requirements drifting out of reach later never traps an
        // ability in the on position.
        toggleAbility: function (skill, ability) {
            const index = this.learnedAbilities.indexOf(ability.id);

            if (index !== -1) {
                this.learnedAbilities.splice(index, 1);

                return;
            }

            if (this.canLearn(skill, ability)) {
                this.learnedAbilities.push(ability.id);
            }
        },

        abilityDomId: function (ability) {
            return 'ability-' + ability.id;
        },
        // The abilities accordion needs its own panel ids. Both steps are in
        // the DOM at once — v-show only hides them — so reusing the skills
        // panel ids would put duplicate ids on the page and Bootstrap would
        // open the wrong panel.
        abilityPanelId: function (category) {
            return 'ability-panel-' + category.id;
        },

        abilityPanelTarget: function (category) {
            return '#' + this.abilityPanelId(category);
        },

        abilityGroupLabel: function (name) {
            return name + ' abilities';
        },

        // Spells this school could still add.
        availableSpells: function (school) {
            const source = this.spellCatalog.find((entry) => entry.id === school.id);

            if (source === undefined) {
                return [];
            }

            return source.spells.filter((spell) => {
                return !school.spells.some((owned) => owned.id === spell.id);
            });
        },

        addSpell: function (school, catalogSpell) {
            school.spells.push({
                id: catalogSpell.id,
                name: catalogSpell.name,
                level: catalogSpell.level,
                cost: catalogSpell.cost,
                description: catalogSpell.description,
            });
        },

        // Losing a spell also takes it out of the spellbook — a spell the
        // character no longer has cannot stay learned.
        removeSpell: function (school, spell) {
            const index = school.spells.indexOf(spell);

            if (index !== -1) {
                school.spells.splice(index, 1);
            }

            this.forgetSpell(spell);
        },

        // Phrased this way round so school names beginning with a vowel do
        // not need an "a"/"an" special case.
        addSpellLabel: function (name) {
            return 'Add a spell to ' + name;
        },

        // What this gear slot could hold: whatever fits and is still in the
        // bag, plus whatever is already in the slot — that one has to stay
        // listed or there would be no way to take it off.
        equippableIn: function (slot) {
            return this.inventory.filter((item) => {
                return item.slot === slot.accepts
                    && (item.qty > 0 || item.id === slot.equipped);
            });
        },

        // Equipping takes one out of the bag, taking something off puts one
        // back, and swapping does both — in that order, so the old item is
        // returned before the new one is taken. Without this, two hand slots
        // could wear the same single dagger.
        equipItem: function (slot, itemId) {
            this.returnToBag(slot.equipped);
            slot.equipped = '';

            if (itemId === '') {
                return;
            }

            const item = this.inventory.find((entry) => entry.id === itemId);

            if (item === undefined || item.qty < 1) {
                return;
            }

            item.qty -= 1;
            slot.equipped = itemId;
        },

        returnToBag: function (itemId) {
            if (itemId === '') {
                return;
            }

            const item = this.inventory.find((entry) => entry.id === itemId);

            if (item !== undefined) {
                item.qty += 1;
            }
        },

        // How many of this item are being worn. The quantity on the row is
        // what is spare, so a count of 1 with 0 spare still reads correctly.
        equippedCount: function (item) {
            return this.gearSlots.filter((slot) => slot.equipped === item.id).length;
        },

        // The badge on an inventory row.
        itemSlotLabel: function (item) {
            const slot = this.itemSlots.find((entry) => entry.id === item.slot);

            return slot === undefined ? item.slot : slot.label;
        },

        addItem: function (catalogItem) {
            this.inventory.push({
                id: catalogItem.id,
                name: catalogItem.name,
                slot: catalogItem.slot,
                qty: this.itemQtyRange.min,
                description: catalogItem.description,
            });
        },

        // Dropping an item also takes it off. Without this a gear slot would
        // keep pointing at an id the inventory no longer contains, and the
        // select would render blank with no way to explain itself.
        removeItem: function (item) {
            for (const slot of this.gearSlots) {
                if (slot.equipped === item.id) {
                    slot.equipped = '';
                }
            }

            const index = this.inventory.indexOf(item);

            if (index !== -1) {
                this.inventory.splice(index, 1);
            }
        },

        forgetSpell: function (spell) {
            const index = this.learnedSpells.indexOf(spell.id);

            if (index !== -1) {
                this.learnedSpells.splice(index, 1);
            }
        },

        isSpellLearned: function (spell) {
            return this.learnedSpells.includes(spell.id);
        },

        // Learn or forget. Forgetting is always allowed; learning stops at
        // what the spellbook holds, so an Intelligence drop never traps a
        // spell in the learned position.
        toggleSpell: function (spell) {
            if (this.isSpellLearned(spell)) {
                this.forgetSpell(spell);

                return;
            }

            if (this.spellsLeft > 0) {
                this.learnedSpells.push(spell.id);
            }
        },

        // A spell already learned can always be clicked, to forget it. One
        // that is not can only be clicked if the book has room.
        canLearnSpell: function (spell) {
            return this.isSpellLearned(spell) || this.spellsLeft > 0;
        },

        // What the Learn button's tooltip says in each of its three states.
        spellLearnTitle: function (spell) {
            if (this.isSpellLearned(spell)) {
                return 'In your spellbook. Click to forget it.';
            }

            if (this.spellsLeft > 0) {
                return 'Add to your spellbook.';
            }

            return 'Your spellbook is full. Raise Intelligence or gain a level.';
        },

        // Level 0 is a cantrip, which is not "Level 0" to anyone who plays.
        spellLevelLabel: function (spell) {
            return spell.level === 0 ? 'Cantrip' : 'Level ' + spell.level;
        },

        spellCostLabel: function (spell) {
            return spell.cost + ' Mana';
        },

        spellDomId: function (spell) {
            return 'spell-' + spell.id;
        },

        spellPanelId: function (school) {
            return 'spell-panel-' + school.id;
        },

        spellPanelTarget: function (school) {
            return '#' + this.spellPanelId(school);
        },
    },

    // computed: values that are updated and cached if dependencies change
    computed: {
        // Every point raised above a stat's floor costs one, so starting
        // each stat at its minimum is free.
        statPointsSpent: function () {
            let spent = 0;

            for (const stat of this.stats) {
                spent += stat.value - stat.min;
            }

            return spent;
        },

        statPointsLeft: function () {
            return this.statPointsBudget - this.statPointsSpent;
        },
        // Only one of the two ID fields is in play at a time. This is it.
        activeId: function () {
            return this.character.type === 'npc'
                ? this.character.npcId
                : this.character.userId;
        },

        // Everyone else on the roster. When editing, the character being
        // edited is not competing with itself — which is why this keys off
        // editingId rather than activeId, since a NEW character typing an id
        // that already exists would otherwise exclude the very row it clashes
        // with and report no clash at all.
        otherCharacters: function () {
            return this.roster.filter((entry) => entry.id !== this.editingId);
        },

        // Two characters may not share a name.
        nameTaken: function () {
            const name = this.character.name.trim().toLowerCase();

            if (name === '') {
                return false;
            }

            return this.otherCharacters.some((entry) => {
                return String(entry.name).trim().toLowerCase() === name;
            });
        },

        // An NPC id identifies one NPC, so it has to be unique. A User ID is
        // the player behind the character, and one player may have several,
        // so user ids are free to repeat as long as the names differ.
        npcIdTaken: function () {
            if (this.character.type !== 'npc') {
                return false;
            }

            const id = this.character.npcId.trim().toLowerCase();

            if (id === '') {
                return false;
            }

            return this.otherCharacters.some((entry) => {
                return entry.type === 'npc'
                    && String(entry.npcId || entry.id).trim().toLowerCase() === id;
            });
        },

        // The first step's Save button stays greyed out until there is a name
        // and an ID, and neither of them clashes with the roster.
        infoComplete: function () {
            return this.character.name.trim() !== ''
                && this.activeId.trim() !== ''
                && !this.nameTaken
                && !this.npcIdTaken;
        },

        // How full the tracker bar is. A computed property is free to call a
        // method — Vue tracks whatever gets read while it runs.
        progressPercent: function () {
            return this.dotLeft(this.currentStep);
        },
        // A number for assistive tech. progressPercent is a CSS string
        // ("40%"); this is the same journey expressed as 0–100.
        progressValue: function () {
            return this.currentStep / (this.steps.length - 1) * 100;
        },
        // The character's derived ceilings. Nothing stores these — they are
        // worked out fresh from the attributes and the level every time one
        // of those moves. The coefficients are game design; tune them freely,
        // and keep the matching string in vitalBars in step, since that is
        // what the tooltips show.
        //
        //   HP = Constitution * 3 + Level * 2
        //   MP = Wisdom * 2 + Level
        //   SP = Dexterity * 2 + Constitution + Level
        // These read the live form. A saved character on the roster needs the
        // same answers from different numbers, so the arithmetic itself lives
        // in maxHpFor / maxMpFor / maxSpFor and both callers go through it.
        maxHp: function () {
            return this.maxHpFor(this.statValue('constitution'), this.vitals.level);
        },

        maxMp: function () {
            return this.maxMpFor(this.statValue('wisdom'), this.vitals.level);
        },

        maxSp: function () {
            return this.maxSpFor(
                this.statValue('dexterity'),
                this.statValue('constitution'),
                this.vitals.level
            );
        },

        // How many spells the character may know at once.
        //
        //   Spells known = Intelligence + Level
        //
        // Nothing reads this yet. It belongs on the Spells step, which is
        // still static markup until Section 10.
        spellsKnown: function () {
            return this.statValue('intelligence') + this.vitals.level;
        },

        // The Level slider in the shape fillPercent expects.
        levelBar: function () {
            return {
                min: this.levelRange.min,
                max: this.levelRange.max,
                value: this.vitals.level,
            };
        },

        // The three derived bars. Everything one bar needs — its colour class,
        // its ceiling, the equation shown in its tooltip — sits in one place,
        // so the wording cannot drift away from the maths above it.
        vitalBars: function () {
            return [
                {
                    id: 'hp',
                    label: 'HP',
                    fillClass: 'range-health',
                    min: 0,
                    max: this.maxHp,
                    value: this.vitals.hp,
                    formula: 'HP = Constitution × 3 + Level × 2',
                },
                {
                    id: 'mp',
                    label: 'MP',
                    fillClass: 'range-mana',
                    min: 0,
                    max: this.maxMp,
                    value: this.vitals.mp,
                    formula: 'MP = Wisdom × 2 + Level',
                },
                {
                    id: 'sp',
                    label: 'SP',
                    fillClass: 'range-stamina',
                    min: 0,
                    max: this.maxSp,
                    value: this.vitals.sp,
                    formula: 'SP = Dexterity × 2 + Constitution + Level',
                },
            ];
        },

        // The pool grows with level. Level 1 gets the base and nothing more.
        statPointsBudget: function () {
            return this.statPointsBase
                + (this.vitals.level - 1) * this.statPointsPerLevel;
        },

        // Over budget is red, exactly spent is amber, anything left is blue.
        // Three outcomes need an if, and a template has room for one ternary —
        // which is the whole reason this is a computed property.
        statPointsBadge: function () {
            if (this.statPointsLeft < 0) {
                return 'bg-danger';
            }

            if (this.statPointsLeft === 0) {
                return 'bg-warning text-dark';
            }

            return 'bg-primary';
        },
        // Categories the character does not already have. No argument, so it
        // caches — compare with availableSkills above, which cannot.
        availableCategories: function () {
            return this.skillCatalog.filter((entry) => {
                return !this.skillCategories.some((owned) => owned.id === entry.id);
            });
        },
        // The two columns, described rather than written out twice. Each
        // carries its own wording and colour, so the markup is one loop.
        effectGroups: function () {
            return [
                {
                    kind: 'buff',
                    title: 'Buffs',
                    tag: 'Buff',
                    badgeClass: 'bg-buff',
                    addLabel: 'Add a buff',
                    emptyLabel: 'No buffs active.',
                    effects: this.effects.filter((effect) => effect.kind === 'buff'),
                },
                {
                    kind: 'debuff',
                    title: 'Debuffs',
                    tag: 'Debuff',
                    badgeClass: 'bg-debuff',
                    addLabel: 'Add a debuff',
                    emptyLabel: 'No debuffs active.',
                    effects: this.effects.filter((effect) => effect.kind === 'debuff'),
                },
            ];

        },
        // Slots the levels have paid for. floor(), because a partial step
        // toward the next one earns nothing.
        featsEarned: function () {
            return Math.floor(this.vitals.level / this.featsPerLevel);
        },

        // Anything allowed above what the levels earned was granted.
        featsBonus: function () {
            return this.featAllowance - this.featsEarned;
        },

        // Slots still open. Goes negative when feats outnumber the allowance.
        featsLeft: function () {
            return this.featAllowance - this.feats.length;
        },

        featsBadgeClass: function () {
            if (this.featsLeft < 0) {
                return 'bg-danger';
            }

            if (this.featsLeft === 0) {
                return 'bg-warning text-dark';
            }

            return 'bg-primary';
        },

        // --- The roster page ---

        // Locked characters, pinned above the search results.
        lockedCharacters: function () {
            return this.roster.filter((entry) => this.lockedIds.includes(entry.id));
        },

        // What the list actually renders: everything pinned, then the current
        // page of everything else. Locked characters sit outside the search,
        // the filter and the paging, which is the whole point of locking one —
        // it stays on screen while you go looking for another. They are in the
        // same list rather than a panel of their own so that the character
        // sheet is written once and both get it.
        visibleRoster: function () {
            return this.lockedCharacters.concat(this.pagedRoster);
        },

        // The roster after the search box and the type buttons have had their
        // say. Locked characters are shown separately above, so they come out
        // of this list rather than appearing twice.
        filteredRoster: function () {
            const term = this.rosterSearchTerm.trim().toLowerCase();

            const matches = this.roster.filter((entry) => {
                if (this.lockedIds.includes(entry.id)) {
                    return false;
                }

                if (this.rosterTypeFilter !== 'all' && entry.type !== this.rosterTypeFilter) {
                    return false;
                }

                if (term === '') {
                    return true;
                }

                const haystack = this.rosterSearchField === 'id'
                    ? String(this.characterIdLabel(entry))
                    : String(entry.name);

                return haystack.toLowerCase().includes(term);
            });

            // sort() rearranges the array it is called on, so this sorts the
            // copy filter() just made rather than the roster itself.
            return matches.sort((first, second) => {
                if (this.rosterSort === 'level') {
                    return this.characterLevel(second) - this.characterLevel(first);
                }

                if (this.rosterSort === 'id') {
                    return String(this.characterIdLabel(first))
                        .localeCompare(String(this.characterIdLabel(second)));
                }

                return String(first.name).localeCompare(String(second.name));
            });
        },

        // At least one page, even when the list is empty, so nothing ever
        // reads "Page 1 of 0".
        rosterPageCount: function () {
            return Math.max(1, Math.ceil(this.filteredRoster.length / this.rosterPageSize));
        },

        rosterPages: function () {
            const pages = [];

            for (let page = 1; page <= this.rosterPageCount; page++) {
                pages.push(page);
            }

            return pages;
        },

        // The slice actually rendered. It clamps rather than trusting
        // rosterPage, because a filter can shrink the list under your feet.
        pagedRoster: function () {
            const page = Math.min(this.rosterPage, this.rosterPageCount);
            const start = (page - 1) * this.rosterPageSize;

            return this.filteredRoster.slice(start, start + this.rosterPageSize);
        },

        // What the chip under the search box says, or '' for no chip at all.
        rosterSearchChip: function () {
            const term = this.rosterSearchTerm.trim();

            if (term === '') {
                return '';
            }

            const field = this.rosterSearchFields
                .find((entry) => entry.id === this.rosterSearchField);

            return (field === undefined ? 'Name' : field.label) + ' contains "' + term + '"';
        },

        rosterTypeChip: function () {
            const filter = this.rosterTypeFilters
                .find((entry) => entry.id === this.rosterTypeFilter);

            return 'Type: ' + (filter === undefined ? 'All' : filter.label);
        },

        // Items the character is not already carrying.
        availableItems: function () {
            return this.itemCatalog.filter((entry) => {
                return !this.inventory.some((owned) => owned.id === entry.id);
            });
        },

        // spellsKnown has been sitting unused since Section 6. This is what it
        // was for: Intelligence + Level is how many spells the book holds.
        spellsLearned: function () {
            return this.learnedSpells.length;
        },

        spellsLeft: function () {
            return this.spellsKnown - this.spellsLearned;
        },

        spellsBadgeClass: function () {
            if (this.spellsLeft < 0) {
                return 'bg-danger';
            }

            if (this.spellsLeft === 0) {
                return 'bg-warning text-dark';
            }

            return 'bg-primary';
        },
    },

    //mounted:  called after the instance has been mounted,
    mounted: function () {
        // Both pages mount the same app. The forge ignores the roster array
        // and the roster ignores the query string; neither costs anything.
        this.seedRoster();
        this.loadRoster();
        this.loadFromQuery();
        this.startTooltips();
        this.clampVitals();
        this.releaseModalFocus();
    },

    //updated:  called after a re-render, so new markup gets its tooltips too
    updated: function () {
        this.startTooltips();
    },

    // watch:   calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {
        // A derived ceiling can fall below the value sitting under it — drop a
        // level and maxHp drops with it. Nothing is "spent" into HP, so the
        // honest answer is to clamp. Stat points are the opposite case: those
        // ARE spent, so they go negative instead and the player chooses what
        // to give back. Naming a method as a string is shorthand for calling it.
        // A narrowing search can leave you on a page that no longer exists.
        rosterSearchTerm: function () { this.rosterPage = 1; },
        rosterTypeFilter: function () { this.rosterPage = 1; },

        maxHp: 'clampVitals',
        maxMp: 'clampVitals',
        maxSp: 'clampVitals',
        // "You may take more, never fewer." Levelling up can raise the floor
        // past the current allowance, so push the allowance up with it. This
        // is the vitals clamp in reverse: there a value was pulled down under
        // a falling ceiling, here one is pushed up off a rising floor.
        featsEarned: function (newEarned) {
            if (this.featAllowance < newEarned) {
                this.featAllowance = newEarned;
            }
        },
    },
});

export default app;
