<script>
import AccordionPanel from '@/components/molecules/AccordionPanel.vue';
import ActionMenu from '@/components/molecules/ActionMenu.vue';
import BudgetBadge from '@/components/atoms/BudgetBadge.vue';
import ConfirmModal from '@/components/molecules/ConfirmModal.vue';
import EntryPanel from '@/components/organisms/EntryPanel.vue';
import RangeSlider from '@/components/molecules/RangeSlider.vue';
import SkillCard from '@/components/molecules/SkillCard.vue';
import SpellCard from '@/components/molecules/SpellCard.vue';
import StatCard from '@/components/molecules/StatCard.vue';
import StepNav from '@/components/molecules/StepNav.vue';
import ToggleButton from '@/components/atoms/ToggleButton.vue';
import vTooltip from '@/directives/tooltip.js';
import { startingStats, npcTypes, levelRange } from '@/data/character.js';
import { skillCatalog, skillRange } from '@/data/skills.js';
import { abilityCatalog } from '@/data/abilities.js';
import { spellCatalog, startingSpellSchools } from '@/data/spells.js';
import { effectCatalog } from '@/data/effects.js';
import { featCatalog, featKinds, featSources, featsPerLevel } from '@/data/feats.js';
import { itemCatalog, startingGearSlots, itemQtyRange } from '@/data/items.js';
import { deepCopy, findById, notOwned, removeFrom } from '@/helpers/lists.js';
import { addMenu } from '@/helpers/menus.js';
import { makeCategory, makeSkill, makeEffect, makeFeat, makeSpell, makeItem } from '@/helpers/builders.js';
import {
    maxHpFor, maxMpFor, maxSpFor, vitalFormulas, spellsKnownFor, featsEarnedFor, statPointsFor,
} from '@/helpers/formulas.js';
import { itemSlotLabel } from '@/helpers/labels.js';
import { storeCharacter, findCharacter } from '@/helpers/storage.js';

// The forge: building or editing one character over six steps. This page
// owns the character being built; the components show its parts and report
// what the player did, and the methods here make the changes.
//
// The world's data (catalogs, starting lists) comes from src/data, the
// equations from helpers/formulas.js, and saving from helpers/storage.js.
// What is left here is the one job of this page: the form.
export default {
    components: {
        AccordionPanel,
        ActionMenu,
        BudgetBadge,
        ConfirmModal,
        EntryPanel,
        RangeSlider,
        SkillCard,
        SpellCard,
        StatCard,
        StepNav,
        ToggleButton,
    },
    directives: {
        tooltip: vTooltip,
    },

    // data:    The character being built, and this page's own wording.
    //          The starting lists are COPIES: a module runs once, so editing
    //          the imported arrays would change them for the next visit too.
    data: function () {
        return {
            // The six steps of the form, in order. The tracker dots and the
            // step panels both read this, so adding a step is one entry here.
            steps: [
                { id: 'character', label: 'Character' },
                { id: 'stats', label: 'Stats' },
                { id: 'skills', label: 'Skills' },
                { id: 'abilities', label: 'Abilities' },
                { id: 'spells', label: 'Spells' },
                { id: 'items', label: 'Items' },
            ],

            // Which step is showing. 0 is the first one.
            currentStep: 0,

            // What the first step collects.
            character: {
                name: '',
                type: 'player', // 'player' or 'npc'
                userId: '',
                npcType: 'unknown', // 'unknown' or one of npcTypes
            },

            // The Vitals card. Current values only: every ceiling is worked out
            // from the stats and the level, so there is nowhere to store a
            // maximum that disagrees with the equation. Anything above its
            // ceiling is pulled down (clampVitals).
            vitals: {
                level: 1,
                hp: 42,
                mp: 12,
                sp: 28,
            },

            stats: deepCopy(startingStats),

            // The skills this character has, grouped the way the accordion
            // shows them: a category holds its own skills. A new character
            // starts with none; they are picked from skillCatalog.
            skillCategories: [],

            // Which abilities this character has learned, by id. The abilities
            // themselves belong to skills (abilityCatalog), so a skill picked
            // on step 3 brings its abilities with it and nothing can disagree.
            learnedAbilities: [],

            // Buffs and debuffs on the character. kind decides which column
            // an effect lands in and the colour of its badge.
            effects: [],

            // Feats the character holds, and how many it may hold. The levels
            // set the floor; anything above that was granted.
            feats: [],
            featAllowance: 0,

            // Every school, each holding the spells this character carries.
            // A spell can be carried without being learned (learnedSpells).
            spellSchools: deepCopy(startingSpellSchools),
            learnedSpells: [],

            // What the character is wearing, and carrying
            gearSlots: deepCopy(startingGearSlots),
            inventory: [],

            // The id of the roster entry being edited, or null for a new
            // character. Not '' or 0: 0 is a real id (the counter starts there).
            editingId: null,

            // A picture of the empty form, taken in mounted before anything
            // loads. Putting it back is how the form resets.
            blankCharacter: null,

            // The alert under the form. Empty text means it stays hidden.
            message: {
                text: '',
                kind: 'alert-success',
            },

            // The ⋮ on each ability. It never changes, so it is data. Edit
            // goes to "#" until the design pages exist.
            abilityMenu: [
                { action: 'edit', label: 'Edit', href: '#', icon: 'bi bi-pencil-square' },
            ],

            // Hover text for the Level label. HP/MP/SP keep theirs in vitalBars.
            levelTooltip: 'Overall experience. Every ceiling below is worked out from this and your attributes.',

            // The Finish button's "are you sure". Keys match ConfirmModal's
            // props, so the page hands the whole object over at once.
            saveConfirm: {
                id: 'confirmSaveModal',
                title: 'Save This Character?',
                message: 'This will save the character and start a new blank form.',
                confirmLabel: 'Save Character',
                cancelLabel: 'Keep Editing',
            },

            // Leaving the forge, by any route. guardLeave remembers where the
            // player was going (leaveTo); a yes sets leaveApproved, and the
            // move happens once the pop-up has finished closing.
            leaveConfirm: {
                id: 'leavePageModal',
                title: 'Leave Character Design?',
                message: 'You will lose all unsaved data. Are you sure you want to leave?',
                confirmLabel: 'Leave',
                cancelLabel: 'Keep Editing',
            },
            leaveTo: '',
            leaveApproved: false,

            // Rules and lists the template reads. Never changed, so no copies.
            npcTypes: npcTypes,
            levelRange: levelRange,
            featsPerLevel: featsPerLevel,
            itemQtyRange: itemQtyRange,
        };
    },

    computed: {
        // --- Character ----------------------------------------------------

        // The first step's Save stays greyed out until there is a name, plus
        // a User ID for a player or a creature type for an NPC.
        infoComplete: function () {
            const detail = this.character.type === 'npc' ? this.character.npcType : this.character.userId;

            return this.character.name.trim() !== '' && detail.trim() !== '';
        },

        // --- The step tracker ---------------------------------------------

        // How full the tracker bar is, as a CSS width ("40%")
        progressPercent: function () {
            return this.dotLeft(this.currentStep);
        },

        // The same journey as a number from 0 to 100, for screen readers
        progressValue: function () {
            return this.currentStep / (this.steps.length - 1) * 100;
        },

        // --- Vitals -------------------------------------------------------

        // The derived ceilings. The equations themselves are in
        // helpers/formulas.js, so the roster's cards use exactly the same maths.
        maxHp: function () {
            return maxHpFor(this.statValue('constitution'), this.vitals.level);
        },

        maxMp: function () {
            return maxMpFor(this.statValue('wisdom'), this.vitals.level);
        },

        maxSp: function () {
            return maxSpFor(this.statValue('dexterity'), this.statValue('constitution'), this.vitals.level);
        },

        // The three derived bars. Everything one bar needs sits in one place:
        // its colour class, its ceiling, and the equation in its tooltip.
        vitalBars: function () {
            return [
                { id: 'hp', label: 'HP', fillClass: 'range-health', min: 0, max: this.maxHp, formula: vitalFormulas.hp },
                { id: 'mp', label: 'MP', fillClass: 'range-mana', min: 0, max: this.maxMp, formula: vitalFormulas.mp },
                { id: 'sp', label: 'SP', fillClass: 'range-stamina', min: 0, max: this.maxSp, formula: vitalFormulas.sp },
            ];
        },

        // The two effect columns, described rather than written out twice.
        // Each carries its own wording and colour, so the markup is one loop.
        effectGroups: function () {
            return [
                {
                    kind: 'buff',
                    title: 'Buffs',
                    tag: 'Buff',
                    badgeClass: 'bg-buff',
                    addLabel: 'Add a buff',
                    emptyLabel: 'No buffs active.',
                    addItems: addMenu('Add a buff', this.availableEffects('buff')),
                    effects: this.effects.filter((effect) => effect.kind === 'buff'),
                },
                {
                    kind: 'debuff',
                    title: 'Debuffs',
                    tag: 'Debuff',
                    badgeClass: 'bg-debuff',
                    addLabel: 'Add a debuff',
                    emptyLabel: 'No debuffs active.',
                    addItems: addMenu('Add a debuff', this.availableEffects('debuff')),
                    effects: this.effects.filter((effect) => effect.kind === 'debuff'),
                },
            ];
        },

        // --- Stats --------------------------------------------------------

        // The pool grows with level (helpers/formulas.js)
        statPointsBudget: function () {
            return statPointsFor(this.vitals.level);
        },

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

        // --- Skills -------------------------------------------------------

        // The + beside "Skills": the categories the character doesn't have yet
        categoryMenu: function () {
            return addMenu('Choose a category', notOwned(skillCatalog, this.skillCategories));
        },

        // --- Feats --------------------------------------------------------

        // Slots the levels have paid for (helpers/formulas.js)
        featsEarned: function () {
            return featsEarnedFor(this.vitals.level);
        },

        // Anything allowed above what the levels earned was granted
        featsBonus: function () {
            return this.featAllowance - this.featsEarned;
        },

        // Slots still open. Goes negative when feats outnumber the allowance.
        featsLeft: function () {
            return this.featAllowance - this.feats.length;
        },

        // The Feats + menu: one heading per feat kind, its choices under it,
        // or a grey note when that kind is used up.
        featMenu: function () {
            const menu = [];

            for (const kind of featKinds) {
                const left = this.availableFeats(kind.id);

                menu.push({ header: kind.label });

                if (left.length === 0) {
                    menu.push({ note: 'Nothing left here' });
                }

                for (const entry of left) {
                    menu.push({ label: entry.name + ' — ' + entry.summary, entry: entry });
                }
            }

            return menu;
        },

        // --- Spells -------------------------------------------------------

        // How many spells the book holds: Intelligence + Level
        spellsKnown: function () {
            return spellsKnownFor(this.statValue('intelligence'), this.vitals.level);
        },

        spellsLearned: function () {
            return this.learnedSpells.length;
        },

        spellsLeft: function () {
            return this.spellsKnown - this.spellsLearned;
        },

        // --- Items --------------------------------------------------------

        // The Inventory + menu: every catalog item not already carried
        itemMenu: function () {
            return addMenu('Choose an item', notOwned(itemCatalog, this.inventory));
        },
    },

    methods: {
        // --- Moving between steps -----------------------------------------

        // Each step's Save submits the form. The browser has already checked
        // required fields by the time this runs. An overspent stat pool is
        // the one thing it can't check for us. The last step asks first.
        nextStep: function () {
            if (this.statPointsLeft < 0) {
                this.message.kind = 'alert-danger';
                this.message.text = 'You are ' + Math.abs(this.statPointsLeft)
                    + ' stat points over budget. Lower a stat before moving on.';

                return;
            }

            this.message.text = '';

            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.scrollToStep();
            } else {
                this.$refs.saveModal.open();
            }
        },

        goBack: function () {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.scrollToStep();
            }
        },

        // Jump straight to a step from the tracker. Step one is always
        // reachable; the rest wait for the same condition as step one's
        // Save button, so you can't skip naming the character.
        stepDisabled: function (index) {
            return index > 0 && !this.infoComplete;
        },

        goToStep: function (index) {
            if (this.stepDisabled(index)) {
                return;
            }

            this.currentStep = index;
            this.scrollToStep();
        },

        // v-show only hides the other steps, so the page doesn't move by
        // itself. Scrolling to the tracker puts the new step at the top.
        // The tracker is this page's own element, reached through its ref:
        // no searching the page.
        scrollToStep: function () {
            this.$refs.tracker.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Where a tracker dot sits along the bar, as a percentage
        dotLeft: function (index) {
            return (index / (this.steps.length - 1)) * 100 + '%';
        },

        // "Step 3, Skills": what a screen reader announces for a dot
        dotLabel: function (step, index) {
            return 'Step ' + (index + 1) + ', ' + step.label;
        },

        // --- Saving and loading -------------------------------------------
        //
        // The form's state is spread across a dozen keys rather than one
        // character object, so these gather it up on the way out and spread
        // it back on the way in. The shape you edit and the shape you store
        // don't have to be the same.

        // Everything worth keeping, as one object. A deep copy, so the saved
        // character doesn't share objects with the live form and keep
        // changing after it was saved.
        collectCharacter: function () {
            return deepCopy({
                id: this.editingId,
                name: this.character.name,
                type: this.character.type,
                userId: this.character.userId,
                npcType: this.character.npcType,
                vitals: this.vitals,
                stats: this.stats,
                skillCategories: this.skillCategories,
                learnedAbilities: this.learnedAbilities,
                feats: this.feats,
                featAllowance: this.featAllowance,
                spellSchools: this.spellSchools,
                learnedSpells: this.learnedSpells,
                gearSlots: this.gearSlots,
                inventory: this.inventory,
                effects: this.effects,
                savedAt: new Date().toISOString(),
            });
        },

        // Spread a saved character back across the form. Each field is copied
        // only if the saved object has it, so a character saved before a
        // feature existed still loads.
        applyCharacter: function (saved) {
            const copy = deepCopy(saved);

            this.character = {
                name: copy.name || '',
                type: copy.type || 'player',
                userId: copy.userId || '',
                npcType: copy.npcType || 'unknown',
            };

            const fields = [
                'vitals', 'stats', 'skillCategories', 'learnedAbilities',
                'feats', 'featAllowance', 'spellSchools', 'learnedSpells',
                'gearSlots', 'inventory', 'effects',
            ];

            for (const field of fields) {
                if (copy[field] !== undefined) {
                    this[field] = copy[field];
                }
            }

            this.currentStep = 0;
        },

        // Start from the blank form, then, if the address asks for one
        // (/forge?id=3), load that saved character to edit.
        loadCharacter: function (id) {
            this.applyCharacter(this.blankCharacter);
            this.editingId = null;
            this.message.text = '';

            if (id === undefined) {
                return;
            }

            // The address bar only holds text ("3"); saved ids are numbers (3)
            const wanted = Number(id);
            const found = findCharacter(wanted);

            if (found === undefined) {
                this.message.kind = 'alert-danger';
                this.message.text = 'No saved character with ID ' + wanted + '.';

                return;
            }

            this.applyCharacter(found);
            this.editingId = found.id;

            this.message.kind = 'alert-success';
            this.message.text = 'Editing "' + found.name + '" (' + found.id
                + '). Saving will update the roster entry.';
        },

        // The save pop-up said yes. Store the character (storage.js hands
        // back its id), then start a blank one.
        saveCharacter: function () {
            const savedId = storeCharacter(this.collectCharacter());
            const text = 'Character "' + this.character.name + '" (' + savedId
                + ') saved to the roster. Starting a new character.';

            if (this.$route.query.id === undefined) {
                this.loadCharacter(undefined);
                this.message.kind = 'alert-success';
                this.message.text = text;

                return;
            }

            // An edit: also clear ?id= from the address, so a refresh doesn't
            // load the old character again. The move is pre-approved, so the
            // leave pop-up doesn't ask. replace() hands back a promise; .then
            // runs once the move is done (and the blank form is loaded).
            this.leaveApproved = true;
            this.$router.replace({ name: 'forge' }).then(() => {
                this.message.kind = 'alert-success';
                this.message.text = text;
            });
        },

        // --- Leaving --------------------------------------------------------

        // Let the move through once the player has said yes; otherwise
        // remember where they were going, ask, and stay for now.
        guardLeave: function (to) {
            if (this.leaveApproved) {
                this.leaveApproved = false;

                return true;
            }

            this.leaveTo = to.fullPath;
            this.$refs.leaveModal.open();

            return false;
        },

        // The leave pop-up has finished closing. If the answer was yes, go
        // now. Waiting matters: leaving while it is still sliding shut stops
        // Bootstrap's clean-up, and the next page would not scroll.
        finishLeave: function () {
            if (this.leaveApproved) {
                this.$router.push(this.leaveTo);
            }
        },

        // --- Stats and vitals -----------------------------------------------

        // One attribute's current value by id
        statValue: function (id) {
            const stat = findById(this.stats, id);

            return stat === undefined ? 0 : stat.value;
        },

        // Pull every current value back under its ceiling. Called on load
        // and whenever a maximum moves.
        clampVitals: function () {
            this.vitals.hp = Math.min(this.vitals.hp, this.maxHp);
            this.vitals.mp = Math.min(this.vitals.mp, this.maxMp);
            this.vitals.sp = Math.min(this.vitals.sp, this.maxSp);
        },

        // --- Effects (buffs and debuffs) ------------------------------------

        // Effects of one kind the character doesn't have yet
        availableEffects: function (kind) {
            return notOwned(effectCatalog.filter((entry) => entry.kind === kind), this.effects);
        },

        addEffect: function (catalogEffect) {
            this.effects.push(makeEffect(catalogEffect));
        },

        removeEffect: function (effect) {
            removeFrom(this.effects, effect);
        },

        // A buff or debuff row's badges: its kind, then how long it lasts
        effectBadges: function (effect) {
            const group = this.effectGroups.find((entry) => entry.kind === effect.kind);

            return [
                { tag: group.tag, badgeClass: group.badgeClass },
                { tag: effect.duration, badgeClass: 'bg-secondary text-dark rounded-pill' },
            ];
        },

        // --- Skills ---------------------------------------------------------

        addCategory: function (catalogCategory) {
            this.skillCategories.push(makeCategory(catalogCategory));
        },

        removeCategory: function (category) {
            removeFrom(this.skillCategories, category);
        },

        // Which skills this category could still add. A method, because the
        // answer depends on which category you ask about.
        availableSkills: function (category) {
            const source = findById(skillCatalog, category.id);

            return source === undefined ? [] : notOwned(source.skills, category.skills);
        },

        // New skills start at the bottom of the shared range
        addSkill: function (category, catalogSkill) {
            category.skills.push(makeSkill(catalogSkill, skillRange.min));
        },

        removeSkill: function (category, skill) {
            removeFrom(category.skills, skill);
        },

        // A category's ⋮: the skills it can still add, then Remove.
        // A method, not computed, because each category has its own list.
        skillCategoryMenu: function (category) {
            const menu = addMenu('Add a skill', this.availableSkills(category));

            // Only the heading means every skill is already added
            if (menu.length === 1) {
                menu.push({ note: 'Nothing left to add' });
            }

            return menu.concat([
                { divider: true },
                { action: 'remove', label: 'Remove category', icon: 'bi bi-trash', danger: true },
            ]);
        },

        // What a pick from that menu means. ActionMenu only says which item.
        pickFromCategory: function (category, item) {
            if (item.action === 'remove') {
                this.removeCategory(category);
            } else {
                this.addSkill(category, item.entry);
            }
        },

        // --- Abilities ------------------------------------------------------

        // The abilities a skill offers, from the catalog
        abilitiesFor: function (skill) {
            const entry = abilityCatalog.find((item) => item.skillId === skill.id);

            return entry === undefined ? [] : entry.abilities;
        },

        isLearned: function (ability) {
            return this.learnedAbilities.includes(ability.id);
        },

        // Which requirements are not met yet, in words. An empty list means
        // the ability is available. Each part of requires is optional.
        abilityBlockers: function (skill, ability) {
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

            if (needs.level !== undefined && this.vitals.level < needs.level) {
                blockers.push('Level ' + needs.level);
            }

            return blockers;
        },

        canLearn: function (skill, ability) {
            return this.abilityBlockers(skill, ability).length === 0;
        },

        // The toggle's tooltip: what it does, or what is missing
        abilityTitle: function (skill, ability) {
            const blockers = this.abilityBlockers(skill, ability);

            return blockers.length === 0 ? ability.description : 'Needs ' + blockers.join(', ');
        },

        // Learn or unlearn. Unlearning is always allowed; only learning is
        // gated, so requirements drifting out of reach later never trap an
        // ability in the on position.
        toggleAbility: function (skill, ability) {
            if (this.isLearned(ability)) {
                removeFrom(this.learnedAbilities, ability.id);
            } else if (this.canLearn(skill, ability)) {
                this.learnedAbilities.push(ability.id);
            }
        },

        // --- Feats ----------------------------------------------------------

        // Feats of one kind the character doesn't have yet
        availableFeats: function (kind) {
            return notOwned(featCatalog.filter((entry) => entry.kind === kind), this.feats);
        },

        // Level-earned slots fill first, so a new feat is "Earned" while the
        // levels still cover it and "Bonus" after
        addFeat: function (catalogFeat) {
            const earnedTaken = this.feats.filter((feat) => feat.source === 'earned').length;

            this.feats.push(makeFeat(catalogFeat, earnedTaken < this.featsEarned ? 'earned' : 'bonus'));
        },

        removeFeat: function (feat) {
            removeFrom(this.feats, feat);
        },

        // A feat row's badges: its kind, then where its slot came from.
        // featKinds and featSources are already shaped { tag, badgeClass }.
        featBadges: function (feat) {
            return [findById(featKinds, feat.kind), findById(featSources, feat.source)];
        },

        // --- Spells ---------------------------------------------------------

        // A school's + menu: the spells it could still add
        spellMenu: function (school) {
            const source = findById(spellCatalog, school.id);

            return addMenu('Add a spell', source === undefined ? [] : notOwned(source.spells, school.spells));
        },

        addSpell: function (school, catalogSpell) {
            school.spells.push(makeSpell(catalogSpell));
        },

        // Losing a spell also takes it out of the spellbook
        removeSpell: function (school, spell) {
            removeFrom(school.spells, spell);
            removeFrom(this.learnedSpells, spell.id);
        },

        isSpellLearned: function (spell) {
            return this.learnedSpells.includes(spell.id);
        },

        // Learn or forget. Forgetting is always allowed; learning stops at
        // what the spellbook holds, so an Intelligence drop never traps a
        // spell in the learned position.
        toggleSpell: function (spell) {
            if (this.isSpellLearned(spell)) {
                removeFrom(this.learnedSpells, spell.id);
            } else if (this.spellsLeft > 0) {
                this.learnedSpells.push(spell.id);
            }
        },

        // --- Items ----------------------------------------------------------

        addItem: function (catalogItem) {
            this.inventory.push(makeItem(catalogItem, itemQtyRange.min));
        },

        // Dropping an item also takes it off, so no gear slot points at an
        // item the inventory no longer has
        removeItem: function (item) {
            for (const slot of this.gearSlots) {
                if (slot.equipped === item.id) {
                    slot.equipped = '';
                }
            }

            removeFrom(this.inventory, item);
        },

        // An inventory row's badges: its slot, then how many are worn (if any)
        itemBadges: function (item) {
            const badges = [{ tag: itemSlotLabel(item), badgeClass: 'bg-primary' }];
            const worn = this.equippedCount(item);

            if (worn > 0) {
                badges.push({ tag: worn + ' worn', badgeClass: 'bg-success' });
            }

            return badges;
        },

        // What a gear slot could hold: whatever fits and is still in the bag,
        // plus whatever is already in the slot (or there'd be no way to take
        // it off)
        equippableIn: function (slot) {
            return this.inventory.filter((item) => {
                return item.slot === slot.accepts && (item.qty > 0 || item.id === slot.equipped);
            });
        },

        // Equipping takes one out of the bag, taking off puts one back, and
        // swapping does both, in that order. Without this, two hand slots
        // could wear the same single dagger.
        equipItem: function (slot, itemId) {
            this.returnToBag(slot.equipped);
            slot.equipped = '';

            if (itemId === '') {
                return;
            }

            const item = findById(this.inventory, itemId);

            if (item === undefined || item.qty < 1) {
                return;
            }

            item.qty -= 1;
            slot.equipped = itemId;
        },

        returnToBag: function (itemId) {
            if (itemId === '') {
                return;
            }

            const item = findById(this.inventory, itemId);

            if (item !== undefined) {
                item.qty += 1;
            }
        },

        // How many of this item are being worn. The row's quantity is what's
        // spare, so 1 worn with 0 spare still reads correctly.
        equippedCount: function (item) {
            return this.gearSlots.filter((slot) => slot.equipped === item.id).length;
        },
    },

    // watch:   Calls the function when the value changes.
    watch: {
        // A derived ceiling can fall below the value under it: drop a level
        // and maxHp drops with it. Nothing is "spent" into HP, so the honest
        // answer is to clamp. Stat points are the opposite case: those ARE
        // spent, so they go negative instead and the player chooses what to
        // give back. Naming a method as a string is shorthand for calling it.
        maxHp: 'clampVitals',
        maxMp: 'clampVitals',
        maxSp: 'clampVitals',

        // "You may take more, never fewer." Levelling up can raise the floor
        // past the current allowance, so push the allowance up with it: the
        // vitals clamp in reverse.
        featsEarned: function (newEarned) {
            if (this.featAllowance < newEarned) {
                this.featAllowance = newEarned;
            }
        },
    },

    // mounted:     Before anything loads, the form holds only data()'s
    //              starting values, so keep a copy for resetting. Then load
    //              whatever the address asks for (?id=3 from the roster).
    mounted: function () {
        this.blankCharacter = this.collectCharacter();
        this.loadCharacter(this.$route.query.id);
        this.clampVitals();
    },

    // beforeRouteLeave:   The router asks before leaving this page, by any
    //                     route: a link, the navbar, or the browser's Back.
    //                     Returning false keeps the player here; the pop-up
    //                     decides whether to go after all.
    beforeRouteLeave: function (to) {
        return this.guardLeave(to);
    },

    // beforeRouteUpdate:  Same page, new address: /forge?id=3 → /forge (the
    //                     navbar's Forge link while editing). Same question;
    //                     on yes, load what the new address asks for.
    beforeRouteUpdate: function (to) {
        const allowed = this.guardLeave(to);

        if (allowed) {
            this.loadCharacter(to.query.id);
        }

        return allowed;
    },
};
</script>

<template>
    <div class="container text-start mt-5 pt-5">
        <!-- No page heading: the Character Design card names the page -->
        <div class="card mb-3">
            <div class="card-body">
                <h3 class="card-title display-3">Character Design</h3>
                <p class="mb-4 text-dark display-6">Build your character from the ground up.</p>

                <!-- Vitals. Outside the form, so it shows on every step. Nothing
                    here stores a maximum: every ceiling is computed from the
                    attributes and the level (helpers/formulas.js), and each
                    equation shows on hover over HP / MP / SP. -->
                <div class="card mb-4 border-primary">
                    <div class="card-body">
                        <h4 class="card-title">Vitals</h4>

                        <RangeSlider id="level" label="Level" variant="level" :min="levelRange.min" :max="levelRange.max"
                            v-model="vitals.level" :tooltip="levelTooltip" show-max />

                        <div class="row row-cols-1 row-cols-lg-2 g-4">
                            <!-- Buffs makes this row tall, so spread the three bars down it -->
                            <div class="col d-flex flex-column justify-content-evenly">
                                <RangeSlider v-for="bar in vitalBars" :key="bar.id" :id="bar.id" :label="bar.label"
                                    variant="vital" :min="bar.min" :max="bar.max" v-model="vitals[bar.id]"
                                    :fill-class="bar.fillClass" :tooltip="bar.formula" show-max />
                            </div>

                            <!-- Buffs / Debuffs -->
                            <div class="col">
                                <div class="row row-cols-1 row-cols-md-2 g-3">
                                    <div class="col" v-for="group in effectGroups" :key="group.kind">
                                        <EntryPanel :title="group.title" :entries="group.effects" :add-items="group.addItems"
                                            :add-label="group.addLabel" :empty-text="group.emptyLabel"
                                            :count-class="group.badgeClass" :badges-for="effectBadges" @add="addEffect"
                                            @remove="removeEffect" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="nextStep">
                    <!-- Step tracker. ref="tracker" is how scrollToStep reaches it. -->
                    <div ref="tracker" class="position-relative mx-4 my-5 step-tracker">
                        <div class="progress" role="progressbar" aria-label="Character creation progress"
                            :aria-valuenow="progressValue" aria-valuemax="100">
                            <div class="progress-bar" :style="{ width: progressPercent }"></div>
                        </div>

                        <button type="button" v-for="(step, index) in steps" :key="step.id"
                            class="position-absolute top-0 translate-middle btn rounded-pill step-dot"
                            :class="index <= currentStep ? 'btn-primary' : 'btn-secondary'" :style="{ left: dotLeft(index) }"
                            :aria-label="dotLabel(step, index)" :disabled="stepDisabled(index)" @click="goToStep(index)"
                            v-tooltip="step.label">
                            {{ index + 1 }}
                        </button>
                    </div>

                    <!-- ===== Step 1: Character ===== -->
                    <div class="character-step" v-show="currentStep === 0">
                        <h3>Character Information</h3>
                        <p class="mb-4 text-body-secondary">Character Needs ID and name before creation.</p>

                        <div class="mb-3">
                            <label for="characterName" class="form-label">Character Name</label>
                            <input type="text" class="form-control" id="characterName" placeholder="Enter Character Name"
                                v-model="character.name" required>
                        </div>

                        <fieldset class="mb-3">
                            <legend class="form-label">Character Type</legend>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="characterType" id="playerCharacter"
                                    value="player" v-model="character.type">
                                <label class="form-check-label" for="playerCharacter">Player Character</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="characterType" id="npcCharacter"
                                    value="npc" v-model="character.type">
                                <label class="form-check-label" for="npcCharacter">Non-Player Character</label>
                            </div>
                        </fieldset>

                        <!-- Only one of these exists at a time, so the unused one
                            can't block validation the way a hidden required field would -->
                        <div class="mb-3" v-if="character.type === 'player'">
                            <label for="userId" class="form-label">User ID</label>
                            <input class="form-control" type="text" id="userId" placeholder="Enter User ID"
                                v-model="character.userId" required>
                        </div>
                        <div class="mb-3" v-else>
                            <label for="npcType" class="form-label">Creature Type</label>
                            <select class="form-select" id="npcType" v-model="character.npcType" required>
                                <option v-for="kind in npcTypes" :key="kind.id" :value="kind.id">{{ kind.label }}</option>
                            </select>
                        </div>

                        <StepNav save-label="Save Info" first :save-disabled="!infoComplete" />
                    </div>

                    <!-- ===== Step 2: Stats ===== -->
                    <div class="character-step" v-show="currentStep === 1">
                        <h3>Build Character Stats</h3>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Available Stat Points:
                                <BudgetBadge :left="statPointsLeft" /></label>
                            <p class="mb-3 text-body-secondary">
                                Choose a value from 1 to 20 for each ability. Spend these across the six attributes below.
                            </p>
                        </div>

                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                            <div class="col" v-for="stat in stats" :key="stat.id">
                                <StatCard :stat="stat" v-model="stat.value" :points-left="statPointsLeft" />
                            </div>
                        </div>

                        <StepNav save-label="Save Stats" @back="goBack" />
                    </div>

                    <!-- ===== Step 3: Skills ===== -->
                    <div class="character-step" v-show="currentStep === 2">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <h3 class="card-title mb-0">Skills</h3>
                            <!-- Offers only the categories the character doesn't
                                have, so it empties as the list fills -->
                            <ActionMenu variant="add" label="Add skill category" :items="categoryMenu"
                                empty-text="Every category added" @select="addCategory($event.entry)" />
                        </div>

                        <div class="accordion mb-3">
                            <AccordionPanel v-for="category in skillCategories" :key="category.id"
                                :id="'skill-' + category.id" :title="category.name">
                                <!-- One menu per category: add a skill, or drop the lot -->
                                <template #menu>
                                    <ActionMenu :label="'Actions for ' + category.name" :items="skillCategoryMenu(category)"
                                        @select="pickFromCategory(category, $event)" />
                                </template>

                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                    <div class="col" v-for="skill in category.skills" :key="skill.id">
                                        <SkillCard :skill="skill" v-model="skill.value" @remove="removeSkill(category, skill)" />
                                    </div>
                                </div>
                                <p class="text-body-secondary mb-0" v-if="category.skills.length === 0">
                                    No skills here yet. Use this category's menu to add one.
                                </p>
                            </AccordionPanel>

                            <p class="text-body-secondary mb-0" v-if="skillCategories.length === 0">
                                No skill categories yet. Use the + beside the heading above.
                            </p>
                        </div>

                        <StepNav save-label="Save Skills" @back="goBack" />
                    </div>

                    <!-- ===== Step 4: Abilities & Feats ===== -->
                    <div class="character-step" v-show="currentStep === 3">
                        <h3 class="card-title mb-2">Abilities &amp; Feats</h3>

                        <!-- Feats: a collapsing panel like the rest of the forge
                            (class feedback; it used to scroll in a box) -->
                        <div class="accordion mb-3">
                            <AccordionPanel id="feats" title="Feats">
                                <div class="d-flex flex-wrap align-items-center gap-3 mb-2">
                                    <span class="badge bg-primary">Level {{ vitals.level }}</span>
                                    <span class="badge bg-secondary text-dark">Earned {{ featsEarned }}</span>
                                    <span class="badge bg-success">Bonus {{ featsBonus }}</span>
                                    <BudgetBadge :left="featsLeft">{{ feats.length }} / {{ featAllowance }}</BudgetBadge>

                                    <div class="d-flex align-items-center gap-2 ms-auto">
                                        <label for="featCount" class="form-label mb-0">Total</label>
                                        <input type="number" class="form-control" id="featCount"
                                            v-model.number="featAllowance" :min="featsEarned" max="20" step="1"
                                            aria-describedby="featCountHelp">
                                    </div>
                                </div>
                                <div id="featCountHelp" class="form-text mb-3">
                                    One feat every {{ featsPerLevel }} levels. You may take more, never fewer.
                                </div>

                                <EntryPanel title="Current Feats" :entries="feats" :add-items="featMenu" add-label="Add feat"
                                    add-empty-text="" empty-text="No feats yet. Use the + beside the heading."
                                    :badges-for="featBadges" @add="addFeat" @remove="removeFeat" />
                            </AccordionPanel>
                        </div>

                        <!-- Abilities. The same categories and skills as the Skills
                            step: one list, two views, so they can't disagree. -->
                        <div class="accordion mb-3">
                            <AccordionPanel v-for="category in skillCategories" :key="category.id"
                                :id="'ability-' + category.id" :title="category.name">
                                <template v-for="skill in category.skills" :key="skill.id">
                                    <h6 class="fw-bold">{{ skill.name }}</h6>

                                    <div class="d-flex flex-wrap gap-2 mb-3" role="group" :aria-label="skill.name + ' abilities'">
                                        <span class="d-inline-flex align-items-center gap-1" v-for="ability in abilitiesFor(skill)"
                                            :key="ability.id">
                                            <ToggleButton :id="'ability-' + ability.id" :checked="isLearned(ability)"
                                                :disabled="!isLearned(ability) && !canLearn(skill, ability)"
                                                :tooltip="abilityTitle(skill, ability)" @toggle="toggleAbility(skill, ability)">
                                                {{ ability.name }}</ToggleButton>
                                            <ActionMenu :label="'Actions for ' + ability.name" :items="abilityMenu" />
                                        </span>

                                        <span class="text-body-secondary" v-if="abilitiesFor(skill).length === 0">
                                            No abilities for this skill yet.
                                        </span>
                                    </div>
                                </template>

                                <p class="text-body-secondary mb-0" v-if="category.skills.length === 0">
                                    No skills in this category. Add one on the Skills step.
                                </p>
                            </AccordionPanel>

                            <p class="text-body-secondary mb-0" v-if="skillCategories.length === 0">
                                No skill categories yet. Add them on the Skills step.
                            </p>
                        </div>

                        <StepNav save-label="Save Abilities" @back="goBack" />
                    </div>

                    <!-- ===== Step 5: Spells ===== -->
                    <div class="character-step" v-show="currentStep === 4">
                        <!-- The eight schools belong to the world, so there is
                            nothing to add or remove here: only which spells in
                            them the character carries -->
                        <h3 class="card-title">Spells</h3>
                        <p class="mb-3 text-body-secondary">
                            Spells are grouped by school of magic. Click Learn to add a spell to your spellbook.
                        </p>

                        <!-- How much the spellbook holds: Intelligence + Level -->
                        <div class="d-flex align-items-center gap-2 mb-4">
                            <span class="form-label fw-semibold mb-0">Spells known:
                                <BudgetBadge :left="spellsLeft">{{ spellsLearned }} / {{ spellsKnown }}</BudgetBadge></span>
                        </div>

                        <div class="accordion mb-3">
                            <AccordionPanel v-for="school in spellSchools" :key="school.id" :id="'spell-' + school.id"
                                :title="school.name">
                                <template #menu>
                                    <ActionMenu variant="add" :label="'Add a spell to ' + school.name" :items="spellMenu(school)"
                                        empty-text="Nothing left to add" @select="addSpell(school, $event.entry)" />
                                </template>

                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                    <div class="col" v-for="spell in school.spells" :key="spell.id">
                                        <SpellCard :spell="spell" :learned="isSpellLearned(spell)" :book-full="spellsLeft <= 0"
                                            @toggle="toggleSpell(spell)" @remove="removeSpell(school, spell)" />
                                    </div>

                                    <div class="col" v-if="school.spells.length === 0">
                                        <p class="text-body-secondary mb-0">
                                            No spells here yet. Use this school's + to add one.
                                        </p>
                                    </div>
                                </div>
                            </AccordionPanel>
                        </div>

                        <StepNav save-label="Save Spells" @back="goBack" />
                    </div>

                    <!-- ===== Step 6: Items ===== -->
                    <div class="character-step" v-show="currentStep === 5">
                        <h3 class="card-title">Items</h3>
                        <p class="mb-4 text-body-secondary">
                            Equip gear on the left. Manage your inventory on the right. A slot only offers what you are
                            carrying, so pick something up before you can put it on.
                        </p>

                        <div class="row row-cols-1 row-cols-lg-2 g-3 mb-3">
                            <!-- Gear -->
                            <div class="col">
                                <div class="card h-100 p-3 bg-light border-primary-subtle shadow-sm">
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">Gear</h5>

                                        <div class="mb-3" v-for="slot in gearSlots" :key="slot.id">
                                            <label :for="slot.id" class="form-label fw-semibold">{{ slot.label }}</label>
                                            <select class="form-select" :id="slot.id" :value="slot.equipped"
                                                @change="equipItem(slot, $event.target.value)">
                                                <option value="">&mdash; Empty &mdash;</option>
                                                <option v-for="item in equippableIn(slot)" :key="item.id" :value="item.id">
                                                    {{ item.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Inventory -->
                            <div class="col">
                                <div class="card h-100 p-3 bg-light border-primary-subtle shadow-sm">
                                    <div class="card-body d-flex flex-column">
                                        <EntryPanel variant="card" title="Inventory" :entries="inventory" :add-items="itemMenu"
                                            add-label="Add item" add-empty-text="Carrying everything there is"
                                            empty-text="Carrying nothing. Use the + beside the heading."
                                            :badges-for="itemBadges" @add="addItem" @remove="removeItem">
                                            <!-- The quantity box, inside every row. Each row hands
                                                its own item back as "entry". -->
                                            <template #extra="{ entry }">
                                                <label :for="'qty-' + entry.id" class="visually-hidden">{{ entry.name }}
                                                    quantity</label>
                                                <input type="number" class="form-control form-control-sm item-qty-input"
                                                    :id="'qty-' + entry.id" v-model.number="entry.qty" min="0"
                                                    :max="itemQtyRange.max" step="1">
                                            </template>
                                        </EntryPanel>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Finish stays a submit, so the form still validates;
                            nextStep opens the save pop-up -->
                        <StepNav save-label="Finish" @back="goBack" />
                    </div>

                    <div class="alert mt-3" :class="message.kind" v-if="message.text" role="alert">
                        {{ message.text }}
                    </div>
                </form>
            </div>
        </div>

        <!-- One leave pop-up for every way out. Leaving waits until it has
            finished closing (finishLeave). -->
        <ConfirmModal ref="leaveModal" v-bind="leaveConfirm" danger @confirm="leaveApproved = true"
            @closed="finishLeave" />

        <!-- The final save, opened by Finish -->
        <ConfirmModal ref="saveModal" v-bind="saveConfirm" @confirm="saveCharacter" />
    </div>
</template>

<style scoped lang="scss">
@use "@/sass/tools" as *;

// Stops the fixed navbar covering whatever the form scrolls to when it moves
// between steps. Needs to clear the top bar's height.
$fixed-navbar-scroll-offset: 7rem;

.character-step {
    display: flex;
    flex-direction: column;
    background-color: $secondary;
    scroll-margin-top: $fixed-navbar-scroll-offset;
}

// The step tracker above the form: the bar and the dots stay in step.
$step-tracker-bar-height: 4px;
$step-tracker-dot-size: 2.75rem;
// A ring around every dot, so the steps still read as circles before they
// are reached (.btn-secondary would give them a border the colour of their fill)
$step-tracker-dot-border-width: 3px;
$step-tracker-dot-border-color: $primary;

.step-tracker {
    // scrollToStep scrolls to this element, so it carries the navbar
    // clearance too, or it would land under the top bar
    scroll-margin-top: $fixed-navbar-scroll-offset;

    .progress {
        --bs-progress-height: #{$step-tracker-bar-height};
    }

    // Bootstrap turns off pointer events on a disabled button, which also
    // kills its tooltip, and a locked step is the one that needs to say what
    // it is. The button is still disabled, so nothing can be clicked.
    .step-dot:disabled {
        pointer-events: auto;
        cursor: not-allowed;
    }

    // Square, so rounded-pill gives a circle
    .step-dot {
        width: $step-tracker-dot-size;
        height: $step-tracker-dot-size;
        padding: 0;
        --bs-btn-font-size: 1rem;
        --bs-btn-line-height: 1;

        // Outranks .btn-secondary, so the ring survives either state
        --bs-btn-border-width: #{$step-tracker-dot-border-width};
        --bs-btn-border-color: #{$step-tracker-dot-border-color};
        --bs-btn-hover-border-color: #{$step-tracker-dot-border-color};
        --bs-btn-disabled-border-color: #{$step-tracker-dot-border-color};
    }
}

// Inventory quantity boxes: wide enough for 99 and no wider. They are in
// the #extra slot, which is this page's own markup, so scoped reaches them.
$item-qty-width: 4.75rem;

.item-qty-input {
    width: $item-qty-width;
}
</style>
