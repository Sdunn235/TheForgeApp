// The rules every character is built on. Shared by the forge, the roster and
// the sample characters, so it lives here rather than in one page.
// A new Character copies what the player edits (startingStats) into its
// own Stat objects; nothing here is ever changed while the app runs.

// The six attributes a new character starts with. min/max live here so the
// ranges are data, not numbers buried in the markup.
export const startingStats = [
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
];

// The creature types an NPC can be (most are D&D 5e place holders). The
// forge's dropdown and the roster's filter both read this one list.
export const npcTypes = [
    { id: 'unknown', label: 'Unknown' },
    { id: 'aberration', label: 'Aberration' },
    { id: 'beast', label: 'Beast' },
    { id: 'celestial', label: 'Celestial' },
    { id: 'construct', label: 'Construct' },
    { id: 'dragon', label: 'Dragon' },
    { id: 'elemental', label: 'Elemental' },
    { id: 'fey', label: 'Fey' },
    { id: 'fiend', label: 'Fiend' },
    { id: 'giant', label: 'Giant' },
    { id: 'humanoid', label: 'Humanoid' },
    { id: 'monstrosity', label: 'Monstrosity' },
    { id: 'ooze', label: 'Ooze' },
    { id: 'plant', label: 'Plant' },
    { id: 'undead', label: 'Undead' },
];

// Level is the one vital whose range is fixed rather than derived.
export const levelRange = { min: 1, max: 50 };

// Stat points: what you start with, and what each level adds.
// Six stats capped at 20 could absorb 114, so the budget stays
// under that until very high level. Both are yours to tune.
export const statPointsBase = 60;
export const statPointsPerLevel = 1;
