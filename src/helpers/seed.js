import { sampleRoster } from '@/data/samples.js';
import { startingStats } from '@/data/character.js';
import { skillCatalog } from '@/data/skills.js';
import { featCatalog } from '@/data/feats.js';
import { spellCatalog } from '@/data/spells.js';
import { itemCatalog, startingGearSlots } from '@/data/items.js';
import { findById } from '@/helpers/lists.js';
import { maxHpFor, maxMpFor, maxSpFor, featsEarnedFor } from '@/helpers/formulas.js';
import { makeCategory, makeSkill, makeFeat, makeSpell, makeItem } from '@/helpers/builders.js';
import { readCharacters, writeCharacters, takeNextId, samplesAdded, markSamplesAdded } from '@/helpers/storage.js';

// The sample characters. Each spec in data/samples.js is written as the
// little that makes it different; buildSampleCharacter expands it into a
// full character using the same catalogs the forge does, so a sample can
// never mention a skill, spell or item that does not exist.
//
// This used to be one 120-line method (Long Method). Now each part of a
// character has its own small builder, and buildSampleCharacter only puts
// the parts together (Extract Method). The builders are not exported:
// they are this file's own working parts.

// Every stat at its starting value, unless the spec gives one.
function buildStats(wanted) {
    return startingStats.map((stat) => ({
        ...stat,
        value: wanted[stat.id] === undefined ? stat.min : wanted[stat.id],
    }));
}

// { gathering: { mining: 62 } } → the Gathering category holding Mining at 62.
// A category or skill the catalog does not have is skipped.
function buildSkillCategories(wanted) {
    const categories = [];

    for (const categoryId of Object.keys(wanted)) {
        const source = findById(skillCatalog, categoryId);

        if (source === undefined) {
            continue;
        }

        const category = makeCategory(source);

        for (const skillId of Object.keys(wanted[categoryId])) {
            const found = findById(source.skills, skillId);

            if (found !== undefined) {
                category.skills.push(makeSkill(found, wanted[categoryId][skillId]));
            }
        }

        categories.push(category);
    }

    return categories;
}

// ['toughness', 'ironWill'] → those feats, all earned by level.
function buildFeats(wanted) {
    const feats = [];

    for (const featId of wanted) {
        const found = findById(featCatalog, featId);

        if (found !== undefined) {
            feats.push(makeFeat(found, 'earned'));
        }
    }

    return feats;
}

// Every school, holding only the spells this character carries.
function buildSpellSchools(wanted) {
    return spellCatalog.map((school) => {
        const ids = wanted[school.id] || [];

        return {
            id: school.id,
            name: school.name,
            spells: school.spells
                .filter((spell) => ids.includes(spell.id))
                .map((spell) => makeSpell(spell)),
        };
    });
}

// { healthPotion: 3 } → three Health Potions in the bag.
function buildInventory(wanted) {
    const inventory = [];

    for (const itemId of Object.keys(wanted)) {
        const found = findById(itemCatalog, itemId);

        if (found !== undefined) {
            inventory.push(makeItem(found, wanted[itemId]));
        }
    }

    return inventory;
}

// The gear slots, with whatever the spec has equipped in each.
function buildGearSlots(wanted) {
    return startingGearSlots.map((slot) => ({
        ...slot,
        equipped: wanted[slot.id] || '',
    }));
}

// One spec → one full character, ready to save.
export function buildSampleCharacter(spec) {
    const stats = buildStats(spec.stats || {});
    const statValue = (id) => findById(stats, id).value;
    const isNpc = spec.type === 'npc';

    return {
        id: takeNextId(),
        name: spec.name,
        type: spec.type,
        userId: isNpc ? '' : spec.userId || '',
        npcType: isNpc ? spec.npcType : '',
        vitals: {
            level: spec.level,
            hp: maxHpFor(statValue('constitution'), spec.level),
            mp: maxMpFor(statValue('wisdom'), spec.level),
            sp: maxSpFor(statValue('dexterity'), statValue('constitution'), spec.level),
        },
        stats: stats,
        skillCategories: buildSkillCategories(spec.skills || {}),
        learnedAbilities: (spec.abilities || []).slice(),
        feats: buildFeats(spec.feats || []),
        featAllowance: featsEarnedFor(spec.level),
        spellSchools: buildSpellSchools(spec.spells || {}),
        learnedSpells: (spec.learned || []).slice(),
        gearSlots: buildGearSlots(spec.gear || {}),
        inventory: buildInventory(spec.items || {}),
        // Samples start with no buffs or debuffs. Written out so every saved
        // character has the same fields.
        effects: [],
        savedAt: new Date().toISOString(),
    };
}

// Add the sample characters once per browser, keeping anything already
// saved. A separate flag rather than "is storage empty?": someone who has
// built characters of their own still gets the samples, and someone who
// deletes a sample does not see it come back on reload.
export function seedRoster() {
    if (samplesAdded()) {
        return;
    }

    const characters = readCharacters();

    for (const spec of sampleRoster) {
        characters.push(buildSampleCharacter(spec));
    }

    writeCharacters(characters);
    markSamplesAdded();
}
