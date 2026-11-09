import { sampleRoster } from '@/data/samples.js';
import { skillCatalog } from '@/data/skills.js';
import { featCatalog } from '@/data/feats.js';
import { itemCatalog } from '@/data/items.js';
import { startingStats } from '@/data/character.js';
import { findById } from '@/helpers/lists.js';
import { characterTypes } from '@/models/characterTypes.js';
import Roster from '@/models/Roster.js';
import Skill from '@/models/Skill.js';
import Feat from '@/models/Feat.js';
import Item from '@/models/Item.js';

// The sample characters. Each spec in data/samples.js is written as the
// little that makes it different; buildSampleCharacter turns it into a
// full Player or Npc using the models' own methods (addCategory, addSpell,
// addItem...), the same ones the forge uses. So a sample can never be
// built differently from a character made by hand, and can never mention
// a skill, spell or item that does not exist.
//
// Storage is off for this assignment (helpers/storage.js), so the samples
// are built fresh every time the app starts.

/**
 * Every stat at its floor, unless the spec gives a value.
 *
 * @param {Object} wanted e.g. { strength: 16 }
 * @returns {Object[]} Plain stats, for the Character constructor.
 */
function buildStats(wanted) {
    return startingStats.map((stat) => ({
        ...stat,
        value: wanted[stat.id] === undefined ? stat.min : wanted[stat.id],
    }));
}

/**
 * One spec → one full character. Not yet in a roster: its id is null.
 *
 * @param {Object} spec One entry of data/samples.js sampleRoster.
 * @returns {Character} A Player or an Npc.
 */
export function buildSampleCharacter(spec) {
    const CharacterClass = characterTypes[spec.type];

    // Name, type field, level and stats; the constructor fills in the rest
    // (empty lists, full vitals, the feat allowance for that level)
    const character = new CharacterClass({
        name: spec.name,
        userId: spec.userId,
        npcType: spec.npcType,
        vitals: { level: spec.level },
        stats: buildStats(spec.stats || {}),
    });

    character.fillVitals();

    // { gathering: { mining: 62 } } → the Gathering category holding Mining at 62
    for (const categoryId of Object.keys(spec.skills || {})) {
        const source = findById(skillCatalog, categoryId);

        if (source === undefined) {
            continue;
        }

        character.addCategory(source);
        const category = character.skillCategories.find(categoryId);

        for (const skillId of Object.keys(spec.skills[categoryId])) {
            const found = findById(source.skills, skillId);

            if (found !== undefined) {
                category.add(new Skill(found, spec.skills[categoryId][skillId]));
            }
        }
    }

    character.learnedAbilities = (spec.abilities || []).slice();

    // Sample feats are all earned by level, as they always were
    for (const featId of spec.feats || []) {
        const found = findById(featCatalog, featId);

        if (found !== undefined) {
            character.feats.add(new Feat(found, 'earned'));
        }
    }

    // Each school holds only the spells this character carries
    for (const school of character.spellSchools) {
        const ids = (spec.spells || {})[school.id] || [];

        for (const spell of character.availableSpells(school)) {
            if (ids.includes(spell.id)) {
                character.addSpell(school, spell);
            }
        }
    }

    character.learnedSpells = (spec.learned || []).slice();

    // { healthPotion: 3 } → three Health Potions in the bag
    for (const itemId of Object.keys(spec.items || {})) {
        const found = findById(itemCatalog, itemId);

        if (found !== undefined) {
            character.inventory.add(new Item(found, spec.items[itemId]));
        }
    }

    // Whatever the spec has equipped in each slot
    for (const slot of character.inventory.gearSlots) {
        slot.equipped = (spec.gear || {})[slot.id] || '';
    }

    return character;
}

/**
 * A roster holding every sample character, each saved so it gets its id.
 * Replaces seedRoster, which wrote the samples into localStorage once.
 *
 * @returns {Roster}
 */
export function buildSampleRoster() {
    const roster = new Roster();

    for (const spec of sampleRoster) {
        roster.save(buildSampleCharacter(spec));
    }

    return roster;
}
