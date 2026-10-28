// Every buff and debuff the world offers.

// What can be applied. Same catalog idea as the skills: this is
// what exists in the world, effects[] is what is on this character.
// Durations and descriptions on the unused ones are placeholders.
export const effectCatalog = [
    { id: 'blessed', name: 'Blessed', kind: 'buff', duration: '10m', description: '+2 to all saving throws.' },
    { id: 'hearty', name: 'Hearty', kind: 'buff', duration: '30m', description: '+5 max HP while active.' },
    { id: 'swift', name: 'Swift', kind: 'buff', duration: '10m', description: '+10 movement while active.' },
    { id: 'focused', name: 'Focused', kind: 'buff', duration: '15m', description: '+2 to spell accuracy.' },
    { id: 'poisoned', name: 'Poisoned', kind: 'debuff', duration: '2m', description: 'Lose 1 HP every 6 seconds.' },
    { id: 'slowed', name: 'Slowed', kind: 'debuff', duration: '1m', description: 'Movement halved.' },
    { id: 'weakened', name: 'Weakened', kind: 'debuff', duration: '5m', description: '-2 to Strength checks.' },
    { id: 'cursed', name: 'Cursed', kind: 'debuff', duration: '30m', description: 'All saving throws at -2.' },
];
