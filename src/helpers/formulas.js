import { featsPerLevel } from '@/data/feats.js';
import { statPointsBase, statPointsPerLevel } from '@/data/character.js';

// The game's equations, written once. The forge asks with the live form's
// numbers and the roster asks with a saved character's, so the two pages
// can never disagree. The numbers are game design: tune them here.

//   HP = Constitution × 3 + Level × 2
export function maxHpFor(constitution, level) {
    return constitution * 3 + level * 2;
}

//   MP = Wisdom × 2 + Level
export function maxMpFor(wisdom, level) {
    return wisdom * 2 + level;
}

//   SP = Dexterity × 2 + Constitution + Level
export function maxSpFor(dexterity, constitution, level) {
    return dexterity * 2 + constitution + level;
}

// The same three equations in words, for the HP / MP / SP tooltips. They sit
// next to the maths so a change to one is a change to both.
export const vitalFormulas = {
    hp: 'HP = Constitution × 3 + Level × 2',
    mp: 'MP = Wisdom × 2 + Level',
    sp: 'SP = Dexterity × 2 + Constitution + Level',
};

//   Spells known = Intelligence + Level
export function spellsKnownFor(intelligence, level) {
    return intelligence + level;
}

// One feat slot every featsPerLevel levels. floor(), because a partial step
// toward the next one earns nothing.
export function featsEarnedFor(level) {
    return Math.floor(level / featsPerLevel);
}

// The stat point pool. Level 1 gets the base and nothing more.
export function statPointsFor(level) {
    return statPointsBase + (level - 1) * statPointsPerLevel;
}
