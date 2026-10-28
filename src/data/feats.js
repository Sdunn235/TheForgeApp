// Every feat the world offers, and the rules for how many a character gets.

// Every feat the world offers. summary is the short line the add
// menu shows; description is the full text on the row's tooltip.
export const featCatalog = [
    { id: 'abilityPoints2', name: '+2 Ability Points', kind: 'points', summary: 'two extra ability points', description: 'Two extra ability points to spend.' },
    { id: 'toughness', name: 'Toughness', kind: 'special', summary: '+10 max HP', description: '+10 max HP. Hardy against everything.' },
    { id: 'ironWill', name: 'Iron Will', kind: 'special', summary: 'resist fear and charm', description: 'Resist fear and charm effects.' },
    { id: 'quickDraw', name: 'Quick Draw', kind: 'special', summary: 'act first in a fight', description: 'Act before anyone else when a fight begins.' },
    { id: 'arcaneGift', name: 'Arcane Gift', kind: 'special', summary: '+15 max MP', description: '+15 max MP. A knack for the arcane.' },
    { id: 'sureFooted', name: 'Sure-Footed', kind: 'special', summary: 'ignore rough terrain', description: 'Rough terrain costs you no extra movement.' },
];

// The two kinds, in menu order. label heads the menu group and tag
// goes on the row badge — the wording differs on purpose.
export const featKinds = [
    { id: 'points', label: 'Ability Points', tag: 'Ability Points', badgeClass: 'bg-primary' },
    { id: 'special', label: 'Special Features', tag: 'Special', badgeClass: 'bg-primary' },
];

// Where a feat's slot came from.
export const featSources = [
    { id: 'earned', tag: 'Earned', badgeClass: 'bg-success' },
    { id: 'bonus', tag: 'Bonus', badgeClass: 'bg-secondary text-dark' },
];

// One feat every this many levels.
export const featsPerLevel = 4;
