import Collection from '@/models/Collection.js';
import EntryGroup from '@/models/EntryGroup.js';
import FeatList from '@/models/FeatList.js';
import Inventory from '@/models/Inventory.js';
import Stat from '@/models/Stat.js';
import Skill from '@/models/Skill.js';
import Spell from '@/models/Spell.js';
import Item from '@/models/Item.js';
import Effect from '@/models/Effect.js';
import { startingStats } from '@/data/character.js';
import { skillCatalog } from '@/data/skills.js';
import { spellCatalog, startingSpellSchools } from '@/data/spells.js';
import { effectCatalog } from '@/data/effects.js';
import { featCatalog } from '@/data/feats.js';
import { itemCatalog } from '@/data/items.js';
import { abilityCatalog } from '@/data/abilities.js';
import { findById, removeFrom } from '@/helpers/lists.js';
import {
    maxHpFor, maxMpFor, maxSpFor, spellsKnownFor, featsEarnedFor, statPointsFor,
} from '@/helpers/formulas.js';

/**
 * One character: everything about them, and every rule for changing them.
 * MVVM's Model: it knows the facts and the rules, and nothing about how a
 * page shows them (no Bootstrap classes in here).
 *
 * The forge used to keep a character as a dozen loose data keys, with about
 * 40 methods reaching into them. Now the forge holds ONE Character and asks
 * it to change itself (Move Method).
 *
 * Built by composition: a character HAS stats, collections of skills,
 * effects, feats and spells, and an Inventory. Each of those looks after
 * its own list.
 *
 * Never used on its own: a character is always a Player or an Npc (the
 * subclasses), which add the fields that differ between the two.
 */
export default class Character {
    /**
     * The type's id. Each subclass sets its own (Player.type = 'player');
     * this one is never used, because no plain Character is ever made.
     * static means it belongs to the class, not to each object.
     */
    static type = '';

    /**
     * The type's readable name. Set by each subclass, like type.
     */
    static label = '';

    /**
     * Builds a character from saved plain data, rebuilding every part as its
     * own model. Leave it out for a brand-new character: every list starts
     * empty and the vitals start full.
     *
     * @param {Object} [saved={}] A character as JSON.stringify wrote it (see toJSON).
     */
    constructor(saved = {}) {
        // null = not in the roster yet. Not 0: 0 is a real id.
        this.id = saved.id ?? null;
        this.name = saved.name || '';
        this.stats = (saved.stats || startingStats).map((stat) => new Stat(stat));
        this.skillCategories = new Collection(
            (saved.skillCategories || []).map((category) => new EntryGroup(category, Skill)),
        );
        this.learnedAbilities = (saved.learnedAbilities || []).slice();
        this.effects = new Collection((saved.effects || []).map((effect) => new Effect(effect)));
        this.feats = new FeatList(saved.feats || []);
        // Every school always exists; a school only differs in what it holds
        this.spellSchools = (saved.spellSchools || startingSpellSchools).map((school) => new EntryGroup(school, Spell));
        this.learnedSpells = (saved.learnedSpells || []).slice();
        this.inventory = new Inventory(saved.inventory || [], saved.gearSlots);
        this.savedAt = saved.savedAt || '';

        // The defaults first, then whatever was saved on top of them
        this.vitals = { level: 1, hp: 0, mp: 0, sp: 0, ...saved.vitals };

        if (saved.vitals === undefined) {
            this.fillVitals();
        }

        // "You may take more, never fewer": at least what the levels earn
        this.featAllowance = Math.max(saved.featAllowance || 0, this.featsEarned);
    }

    // --- Type ----------------------------------------------------------------

    /**
     * Read from the class, so it can't be changed on one object by mistake
     * (the teacher's Book pattern). this.constructor is the class the object
     * was made from: Player or Npc.
     *
     * @returns {string} 'player' or 'npc'.
     */
    get type() {
        return this.constructor.type;
    }

    /**
     * @returns {string} "Player" or "NPC".
     */
    get typeLabel() {
        return this.constructor.label;
    }

    /**
     * The grey badge on the roster. Each subclass says what goes there.
     *
     * @returns {string}
     */
    get tagLabel() {
        return '';
    }

    /**
     * Has the first step of the forge been filled in? Every character needs
     * a name; each subclass adds what else it needs.
     *
     * @returns {boolean}
     */
    get isComplete() {
        return this.name.trim() !== '';
    }

    // --- Stats and vitals ----------------------------------------------------

    /**
     * @returns {number}
     */
    get level() {
        return this.vitals.level;
    }

    /**
     * One attribute's value by id.
     *
     * @param {string} id 'strength', 'wisdom'...
     * @returns {number} The value, or 0 if there is no such stat.
     */
    statValue(id) {
        const stat = findById(this.stats, id);

        return stat === undefined ? 0 : stat.value;
    }

    /**
     * The ceilings come from helpers/formulas.js, so the roster's cards and
     * the forge always use the same maths.
     *
     * @returns {number}
     */
    get maxHp() {
        return maxHpFor(this.statValue('constitution'), this.level);
    }

    /**
     * @returns {number}
     */
    get maxMp() {
        return maxMpFor(this.statValue('wisdom'), this.level);
    }

    /**
     * @returns {number}
     */
    get maxSp() {
        return maxSpFor(this.statValue('dexterity'), this.statValue('constitution'), this.level);
    }

    /**
     * HP / MP / SP, each as current out of its ceiling, for the roster's badges.
     *
     * @returns {{id: string, label: string, value: number, max: number}[]}
     */
    get vitalBars() {
        return [
            { id: 'hp', label: 'HP', value: this.vitals.hp, max: this.maxHp },
            { id: 'mp', label: 'MP', value: this.vitals.mp, max: this.maxMp },
            { id: 'sp', label: 'SP', value: this.vitals.sp, max: this.maxSp },
        ];
    }

    /**
     * Set every vital to its ceiling. A new character starts at full health.
     */
    fillVitals() {
        this.vitals.hp = this.maxHp;
        this.vitals.mp = this.maxMp;
        this.vitals.sp = this.maxSp;
    }

    /**
     * Pull every vital back under its ceiling. Called when a ceiling drops
     * (drop a level and maxHp drops with it).
     */
    clampVitals() {
        this.vitals.hp = Math.min(this.vitals.hp, this.maxHp);
        this.vitals.mp = Math.min(this.vitals.mp, this.maxMp);
        this.vitals.sp = Math.min(this.vitals.sp, this.maxSp);
    }

    /**
     * The stat point pool. It grows with level.
     *
     * @returns {number}
     */
    get statPointsBudget() {
        return statPointsFor(this.level);
    }

    /**
     * @returns {number} Points used across all six stats.
     */
    get statPointsSpent() {
        let spent = 0;

        for (const stat of this.stats) {
            spent += stat.spent;
        }

        return spent;
    }

    /**
     * @returns {number} Points still to spend. Negative means over budget.
     */
    get statPointsLeft() {
        return this.statPointsBudget - this.statPointsSpent;
    }

    // --- Effects (buffs and debuffs) -----------------------------------------

    /**
     * @param {string} kind 'buff' or 'debuff'.
     * @returns {Effect[]} The effects of that kind on this character.
     */
    effectsOfKind(kind) {
        return this.effects.filter((effect) => effect.kind === kind);
    }

    /**
     * @param {string} kind 'buff' or 'debuff'.
     * @returns {Object[]} Catalog effects of that kind this character doesn't have.
     */
    availableEffects(kind) {
        return this.effects.missingFrom(effectCatalog.filter((entry) => entry.kind === kind));
    }

    /**
     * @param {Object} catalogEffect An entry from data/effects.js.
     */
    addEffect(catalogEffect) {
        this.effects.add(new Effect(catalogEffect));
    }

    // --- Skills --------------------------------------------------------------

    /**
     * @returns {Object[]} Catalog categories this character doesn't have yet.
     */
    get availableCategories() {
        return this.skillCategories.missingFrom(skillCatalog);
    }

    /**
     * A category from the catalog, empty until skills are added to it.
     *
     * @param {Object} catalogCategory An entry from data/skills.js skillCatalog.
     */
    addCategory(catalogCategory) {
        this.skillCategories.add(new EntryGroup(catalogCategory, Skill));
    }

    /**
     * The skills a category could still add.
     *
     * @param {EntryGroup} category One of this character's categories.
     * @returns {Object[]}
     */
    availableSkills(category) {
        const source = findById(skillCatalog, category.id);

        return source === undefined ? [] : category.missingFrom(source.skills);
    }

    /**
     * New skills start at the bottom of the skill range.
     *
     * @param {EntryGroup} category
     * @param {Object}     catalogSkill
     */
    addSkill(category, catalogSkill) {
        category.add(new Skill(catalogSkill));
    }

    // --- Abilities -----------------------------------------------------------

    /**
     * Every learned ability as its full catalog entry, so the roster shows
     * names rather than ids.
     *
     * @returns {Object[]}
     */
    get abilities() {
        return abilityCatalog
            .flatMap((entry) => entry.abilities)
            .filter((ability) => this.learnedAbilities.includes(ability.id));
    }

    /**
     * @param {Object} ability
     * @returns {boolean}
     */
    isLearned(ability) {
        return this.learnedAbilities.includes(ability.id);
    }

    /**
     * Which requirements are not met yet, in words. An empty list means the
     * ability can be learned. Each part of requires is optional.
     *
     * @param {Skill}  skill   The skill the ability belongs to.
     * @param {Object} ability A catalog ability.
     * @returns {string[]} e.g. ["Mining 25", "Level 5"].
     */
    abilityBlockers(skill, ability) {
        const blockers = [];
        const needs = ability.requires;

        if (needs === undefined) {
            return blockers;
        }

        if (needs.skill !== undefined && skill.value < needs.skill) {
            blockers.push(skill.name + ' ' + needs.skill);
        }

        if (needs.stat !== undefined && this.statValue(needs.stat.id) < needs.stat.value) {
            const stat = findById(this.stats, needs.stat.id);

            blockers.push((stat === undefined ? needs.stat.id : stat.label) + ' ' + needs.stat.value);
        }

        if (needs.level !== undefined && this.level < needs.level) {
            blockers.push('Level ' + needs.level);
        }

        return blockers;
    }

    /**
     * @param {Skill}  skill
     * @param {Object} ability
     * @returns {boolean}
     */
    canLearn(skill, ability) {
        return this.abilityBlockers(skill, ability).length === 0;
    }

    /**
     * Learn or unlearn. Unlearning is always allowed; only learning is
     * gated, so requirements drifting out of reach never trap an ability on.
     *
     * @param {Skill}  skill
     * @param {Object} ability
     */
    toggleAbility(skill, ability) {
        if (this.isLearned(ability)) {
            removeFrom(this.learnedAbilities, ability.id);
        } else if (this.canLearn(skill, ability)) {
            this.learnedAbilities.push(ability.id);
        }
    }

    // --- Feats ---------------------------------------------------------------

    /**
     * @returns {number} Slots the levels have paid for.
     */
    get featsEarned() {
        return featsEarnedFor(this.level);
    }

    /**
     * @returns {number} Slots allowed above what the levels earned.
     */
    get featsBonus() {
        return this.featAllowance - this.featsEarned;
    }

    /**
     * @returns {number} Slots still open. Negative means too many feats.
     */
    get featsLeft() {
        return this.featAllowance - this.feats.count;
    }

    /**
     * Levelling up can raise the floor past the allowance, so push the
     * allowance up with it. The vitals clamp in reverse.
     */
    keepFeatAllowance() {
        this.featAllowance = Math.max(this.featAllowance, this.featsEarned);
    }

    /**
     * @param {string} kind 'points' or 'special'.
     * @returns {Object[]} Catalog feats of that kind this character doesn't have.
     */
    availableFeats(kind) {
        return this.feats.missingFrom(featCatalog.filter((entry) => entry.kind === kind));
    }

    /**
     * @param {Object} catalogFeat An entry from data/feats.js.
     */
    addFeat(catalogFeat) {
        this.feats.addFeat(catalogFeat, this.featsEarned);
    }

    // --- Spells --------------------------------------------------------------

    /**
     * How many spells the spellbook holds: Intelligence + Level.
     *
     * @returns {number}
     */
    get spellsKnown() {
        return spellsKnownFor(this.statValue('intelligence'), this.level);
    }

    /**
     * @returns {number} Room left in the spellbook.
     */
    get spellsLeft() {
        return this.spellsKnown - this.learnedSpells.length;
    }

    /**
     * Every learned spell, found in the character's own schools, so a spell
     * keeps whatever level and cost it was saved with.
     *
     * @returns {Spell[]}
     */
    get spellbook() {
        return this.spellSchools
            .flatMap((school) => school.items)
            .filter((spell) => this.learnedSpells.includes(spell.id));
    }

    /**
     * The spells a school could still add.
     *
     * @param {EntryGroup} school
     * @returns {Object[]}
     */
    availableSpells(school) {
        const source = findById(spellCatalog, school.id);

        return source === undefined ? [] : school.missingFrom(source.spells);
    }

    /**
     * @param {EntryGroup} school
     * @param {Object}     catalogSpell
     */
    addSpell(school, catalogSpell) {
        school.add(new Spell(catalogSpell));
    }

    /**
     * Losing a spell also takes it out of the spellbook.
     *
     * @param {EntryGroup} school
     * @param {Spell}      spell
     */
    removeSpell(school, spell) {
        school.remove(spell);
        removeFrom(this.learnedSpells, spell.id);
    }

    /**
     * @param {Spell} spell
     * @returns {boolean}
     */
    isSpellLearned(spell) {
        return this.learnedSpells.includes(spell.id);
    }

    /**
     * Learn or forget. Forgetting is always allowed; learning stops when the
     * spellbook is full, so an Intelligence drop never traps a spell.
     *
     * @param {Spell} spell
     */
    toggleSpell(spell) {
        if (this.isSpellLearned(spell)) {
            removeFrom(this.learnedSpells, spell.id);
        } else if (this.spellsLeft > 0) {
            this.learnedSpells.push(spell.id);
        }
    }

    // --- Items ---------------------------------------------------------------

    /**
     * @returns {Object[]} Catalog items not already in the bag.
     */
    get availableItems() {
        return this.inventory.missingFrom(itemCatalog);
    }

    /**
     * @param {Object} catalogItem An entry from data/items.js.
     */
    addItem(catalogItem) {
        this.inventory.add(new Item(catalogItem));
    }

    /**
     * @returns {Object[]} The gear slots with item names, for the roster.
     */
    get gear() {
        return this.inventory.gear;
    }

    // --- Copying -------------------------------------------------------------

    /**
     * The plain data JSON.stringify writes for a character: what is saved,
     * downloaded, and copied. Getters are never written, only fields.
     * Subclasses add their own fields on top (see Player.toJSON).
     *
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            vitals: this.vitals,
            stats: this.stats,
            skillCategories: this.skillCategories,
            learnedAbilities: this.learnedAbilities,
            feats: this.feats,
            featAllowance: this.featAllowance,
            spellSchools: this.spellSchools,
            learnedSpells: this.learnedSpells,
            gearSlots: this.inventory.gearSlots,
            inventory: this.inventory,
            effects: this.effects,
            savedAt: this.savedAt,
        };
    }

    /**
     * A full, separate copy: same class, same data, no shared lists.
     *
     * The teacher's hint, Object.assign(new Book(), oldBook), copies one
     * level deep. That is enough for a Book, but a character's lists would
     * still be SHARED between the copy and the original. So instead: write
     * the character out as plain JSON, then build a new one from it. Every
     * list and entry is rebuilt as its own model by the constructors.
     *
     * @returns {Character} A Player or an Npc, whichever this one is.
     */
    clone() {
        return this.convertTo(this.constructor);
    }

    /**
     * The same character as another type (the forge's Player / NPC radio).
     * Everything they share comes across; fields only the old type had
     * (a Player's User ID) are left behind.
     *
     * @param {Function} CharacterClass Player or Npc.
     * @returns {Character}
     */
    convertTo(CharacterClass) {
        return new CharacterClass(JSON.parse(JSON.stringify(this)));
    }
}
