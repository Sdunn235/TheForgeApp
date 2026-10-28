// What each skill unlocks. requires gates the toggle: any of
// skill / stat / level, all optional. These thresholds are game
// design and meant to be tuned.
export const abilityCatalog = [
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
];