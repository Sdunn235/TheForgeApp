import { skillRange } from '@/data/skills.js';

// A character's own copy of a catalog entry. Copying field by field, rather
// than pushing the catalog object itself, matters: push the original and every
// character who learns Mining shares one object, so raising it on one raises
// it on all of them.
// The forge's + menus and the sample characters both build entries here, so
// the two can never build them differently (Data Clumps → Extract Method).

// A skill category, empty until skills are added to it.
export function makeCategory(catalogCategory) {
    return {
        id: catalogCategory.id,
        name: catalogCategory.name,
        skills: [],
    };
}

// A skill, scored on the shared skill range.
export function makeSkill(catalogSkill, value) {
    return {
        id: catalogSkill.id,
        name: catalogSkill.name,
        description: catalogSkill.description,
        min: skillRange.min,
        max: skillRange.max,
        value: value,
    };
}

// source is 'earned' or 'bonus' (see featSources in data/feats.js).
export function makeFeat(catalogFeat, source) {
    return {
        id: catalogFeat.id,
        name: catalogFeat.name,
        kind: catalogFeat.kind,
        source: source,
        description: catalogFeat.description,
    };
}

export function makeSpell(catalogSpell) {
    return {
        id: catalogSpell.id,
        name: catalogSpell.name,
        level: catalogSpell.level,
        cost: catalogSpell.cost,
        description: catalogSpell.description,
    };
}

export function makeItem(catalogItem, qty) {
    return {
        id: catalogItem.id,
        name: catalogItem.name,
        slot: catalogItem.slot,
        qty: qty,
        description: catalogItem.description,
    };
}

export function makeEffect(catalogEffect) {
    return {
        id: catalogEffect.id,
        name: catalogEffect.name,
        kind: catalogEffect.kind,
        duration: catalogEffect.duration,
        description: catalogEffect.description,
    };
}
