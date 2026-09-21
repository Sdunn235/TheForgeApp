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

            // The pool a character spends across the six attributes. Six stats
            // capped at 20 could absorb 114, so anything under that forces a
            // trade-off. Tune this number to taste.
            statPointsBudget: 60,


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
        };
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        // How far along its track a slider is, as a percentage. forge.scss
        // paints the filled part of the track from --range-fill.
        fillPercent: function (stat) {
            const span = stat.max - stat.min;
            const filled = span === 0 ? 0 : (stat.value - stat.min) / span * 100;

            return filled + '%';
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
    },

    //mounted:  called after the instance has been mounted,
    mounted: function () { },

    // watch:   calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {},
});

export default app;
