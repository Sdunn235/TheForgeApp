// One entry per design area on the home page: its words, its art,
// and the two links in its menu. A link with 'to' is a page of this app (a
// router link); 'href: #' waits for a design page that doesn't exist yet.
export const forges = [
    {
        title: 'Character Design',
        image: '/images/anvil.png',
        alt: 'Hammer and anvil',
        description: 'Create, edit, or view characters and NPCs in the world.',
        buttonLabel: 'Forge Characters',
        links: [
            { label: 'Create/Edit', to: { name: 'forge' } },
            { label: 'View Characters', to: { name: 'roster' } },
        ],
    },
    {
        title: 'Attributes Design',
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
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
        image: '/images/anvil.png',
        alt: 'Hammer and anvil',
        description: 'This is where gear and inventory are made. Weapons, armor, consumables and curiosities, each with the slot it fills, the quantity it stacks to, and what it does for whoever carries it.',
        buttonLabel: 'Forge Items',
        links: [
            { label: 'Create/Edit', href: '#' },
            { label: 'View Items', href: '#' },
        ],
    },
];