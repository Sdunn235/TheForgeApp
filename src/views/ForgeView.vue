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
import Player from '@/models/Player.js';
import Npc from '@/models/Npc.js';
import { characterTypes } from '@/models/characterTypes.js';
import { npcTypes, levelRange } from '@/data/character.js';
import { featKinds, featSources, featsPerLevel } from '@/data/feats.js';
import { itemQtyRange } from '@/data/items.js';
import { findById } from '@/helpers/lists.js';
import { addMenu } from '@/helpers/menus.js';
import { vitalFormulas } from '@/helpers/formulas.js';

// The forge: building or editing one character over six steps.
//
// The character being built is ONE object, a Player or an Npc
// (src/models). It knows its own rules: its ceilings, its budgets, what
// it may learn, how equipping works. The template asks it directly
// (character.statPointsLeft) and tells it what the player did
// (character.addFeat(...)).
//
// What is left on this page is the form itself: which step is showing,
// the menus and badges (how things look), saving, and leaving.
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

    // inject:  From App.vue's provide. The roster is read to find the
    //          character being edited; saving goes back through App,
    //          which owns the roster.
    inject: ['roster', 'saveToRoster'],

    // data:    The character being built, and this page's own wording.
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

            // The character being built or edited. A new one starts as a
            // Player; the radio on step 1 can turn it into an Npc. Its id is
            // null until the roster saves it (models/Roster.js save).
            character: new Player(),

            // The type ids, from the classes, so 'player' is never typed here
            types: {
                player: Player.type,
                npc: Npc.type,
            },

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

        // The Player / NPC radio. A Player and an Npc are different classes,
        // so changing the type means swapping the object for one of the
        // other class, carrying everything they share across (convertTo).
        // get/set lets v-model work on it like an ordinary field.
        characterType: {
            get: function () {
                return this.character.type;
            },
            set: function (type) {
                this.character = this.character.convertTo(characterTypes[type]);
            },
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

        // The three bars. The ceilings come from the character; the colour
        // class and the tooltip are how this page shows them.
        vitalBars: function () {
            return [
                { id: 'hp', label: 'HP', fillClass: 'range-health', min: 0, max: this.character.maxHp, formula: vitalFormulas.hp },
                { id: 'mp', label: 'MP', fillClass: 'range-mana', min: 0, max: this.character.maxMp, formula: vitalFormulas.mp },
                { id: 'sp', label: 'SP', fillClass: 'range-stamina', min: 0, max: this.character.maxSp, formula: vitalFormulas.sp },
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
                    addItems: addMenu('Add a buff', this.character.availableEffects('buff')),
                    effects: this.character.effectsOfKind('buff'),
                },
                {
                    kind: 'debuff',
                    title: 'Debuffs',
                    tag: 'Debuff',
                    badgeClass: 'bg-debuff',
                    addLabel: 'Add a debuff',
                    emptyLabel: 'No debuffs active.',
                    addItems: addMenu('Add a debuff', this.character.availableEffects('debuff')),
                    effects: this.character.effectsOfKind('debuff'),
                },
            ];
        },

        // --- Skills -------------------------------------------------------

        // The + beside "Skills": the categories the character doesn't have yet
        categoryMenu: function () {
            return addMenu('Choose a category', this.character.availableCategories);
        },

        // --- Feats --------------------------------------------------------

        // The Feats + menu: one heading per feat kind, its choices under it,
        // or a grey note when that kind is used up.
        featMenu: function () {
            const menu = [];

            for (const kind of featKinds) {
                const left = this.character.availableFeats(kind.id);

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

        // --- Items --------------------------------------------------------

        // The Inventory + menu: every catalog item not already carried
        itemMenu: function () {
            return addMenu('Choose an item', this.character.availableItems);
        },
    },

    methods: {
        // --- Moving between steps -----------------------------------------

        // Each step's Save submits the form. The browser has already checked
        // required fields by the time this runs. An overspent stat pool is
        // the one thing it can't check for us. The last step asks first.
        nextStep: function () {
            const left = this.character.statPointsLeft;

            if (left < 0) {
                this.message.kind = 'alert-danger';
                this.message.text = 'You are ' + Math.abs(left)
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
        // reachable; the rest wait until step one is filled in, so you can't
        // skip naming the character. The character says when it is.
        stepDisabled: function (index) {
            return index > 0 && !this.character.isComplete;
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
        // The form edits a COPY (clone) of a saved character, and saves a
        // copy of the form. So the roster never shares an object with the
        // form, and nothing changes in the roster until Save.

        // Start a blank character, then, if the address asks for one
        // (/forge?id=3), load a copy of that saved character to edit.
        loadCharacter: function (id) {
            this.character = new Player();
            this.currentStep = 0;
            this.message.text = '';

            if (id === undefined) {
                return;
            }

            // The address bar only holds text ("3"); saved ids are numbers (3)
            const wanted = Number(id);
            const found = this.roster.find(wanted);

            if (found === undefined) {
                this.message.kind = 'alert-danger';
                this.message.text = 'No saved character with ID ' + wanted + '.';

                return;
            }

            this.character = found.clone();

            this.message.kind = 'alert-success';
            this.message.text = 'Editing "' + found.name + '" (' + found.id
                + '). Saving will update the roster entry.';
        },

        // The save pop-up said yes. App saves a copy into the roster and
        // hands back its id, then the form starts a blank character.
        saveCharacter: function () {
            const savedId = this.saveToRoster(this.character.clone());
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

        // --- Badges and menus (how things look) -----------------------------

        // A buff or debuff row's badges: its kind, then how long it lasts
        effectBadges: function (effect) {
            const group = this.effectGroups.find((entry) => entry.kind === effect.kind);

            return [
                { tag: group.tag, badgeClass: group.badgeClass },
                { tag: effect.duration, badgeClass: 'bg-secondary text-dark rounded-pill' },
            ];
        },

        // A category's ⋮: the skills it can still add, then Remove.
        // A method, not computed, because each category has its own list.
        skillCategoryMenu: function (category) {
            const menu = addMenu('Add a skill', this.character.availableSkills(category));

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
                this.character.skillCategories.remove(category);
            } else {
                this.character.addSkill(category, item.entry);
            }
        },

        // The ability toggle's tooltip: what it does, or what is missing.
        // The character works out what is missing; this page puts it in words.
        abilityTitle: function (skill, ability) {
            const blockers = this.character.abilityBlockers(skill, ability);

            return blockers.length === 0 ? ability.description : 'Needs ' + blockers.join(', ');
        },

        // A feat row's badges: its kind, then where its slot came from.
        // featKinds and featSources are already shaped { tag, badgeClass }.
        featBadges: function (feat) {
            return [findById(featKinds, feat.kind), findById(featSources, feat.source)];
        },

        // A school's + menu: the spells it could still add
        spellMenu: function (school) {
            return addMenu('Add a spell', this.character.availableSpells(school));
        },

        // An inventory row's badges: its slot, then how many are worn (if any)
        itemBadges: function (item) {
            const badges = [{ tag: item.slotLabel, badgeClass: 'bg-primary' }];
            const worn = this.character.inventory.wornCount(item);

            if (worn > 0) {
                badges.push({ tag: worn + ' worn', badgeClass: 'bg-success' });
            }

            return badges;
        },
    },

    // watch:   Calls the function when the value changes. A dotted string
    //          watches a value inside an object, here a getter on the
    //          character, which re-runs when what it reads changes.
    watch: {
        // A derived ceiling can fall below the value under it: drop a level
        // and maxHp drops with it. Nothing is "spent" into HP, so the honest
        // answer is to clamp. Stat points are the opposite case: those ARE
        // spent, so they go negative instead and the player chooses what to
        // give back.
        'character.maxHp': function () {
            this.character.clampVitals();
        },
        'character.maxMp': function () {
            this.character.clampVitals();
        },
        'character.maxSp': function () {
            this.character.clampVitals();
        },

        // "You may take more, never fewer." Levelling up can raise the floor
        // past the current allowance, so the allowance goes up with it.
        'character.featsEarned': function () {
            this.character.keepFeatAllowance();
        },
    },

    // mounted:     Load whatever the address asks for (?id=3 from the
    //              roster), or a blank character.
    mounted: function () {
        this.loadCharacter(this.$route.query.id);
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
                            v-model="character.vitals.level" :tooltip="levelTooltip" show-max />

                        <div class="row row-cols-1 row-cols-lg-2 g-4">
                            <!-- Buffs makes this row tall, so spread the three bars down it -->
                            <div class="col d-flex flex-column justify-content-evenly">
                                <RangeSlider v-for="bar in vitalBars" :key="bar.id" :id="bar.id" :label="bar.label"
                                    variant="vital" :min="bar.min" :max="bar.max" v-model="character.vitals[bar.id]"
                                    :fill-class="bar.fillClass" :tooltip="bar.formula" show-max />
                            </div>

                            <!-- Buffs / Debuffs -->
                            <div class="col">
                                <div class="row row-cols-1 row-cols-md-2 g-3">
                                    <div class="col" v-for="group in effectGroups" :key="group.kind">
                                        <EntryPanel :title="group.title" :entries="group.effects" :add-items="group.addItems"
                                            :add-label="group.addLabel" :empty-text="group.emptyLabel"
                                            :count-class="group.badgeClass" :badges-for="effectBadges" @add="character.addEffect($event)"
                                            @remove="character.effects.remove($event)" />
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
                                    :value="types.player" v-model="characterType">
                                <label class="form-check-label" for="playerCharacter">Player Character</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="characterType" id="npcCharacter"
                                    :value="types.npc" v-model="characterType">
                                <label class="form-check-label" for="npcCharacter">Non-Player Character</label>
                            </div>
                        </fieldset>

                        <!-- Only one of these exists at a time, so the unused one
                            can't block validation the way a hidden required field would -->
                        <div class="mb-3" v-if="character.type === types.player">
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

                        <StepNav save-label="Save Info" first :save-disabled="!character.isComplete" />
                    </div>

                    <!-- ===== Step 2: Stats ===== -->
                    <div class="character-step" v-show="currentStep === 1">
                        <h3>Build Character Stats</h3>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Available Stat Points:
                                <BudgetBadge :left="character.statPointsLeft" /></label>
                            <p class="mb-3 text-body-secondary">
                                Choose a value from 1 to 20 for each ability. Spend these across the six attributes below.
                            </p>
                        </div>

                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                            <div class="col" v-for="stat in character.stats" :key="stat.id">
                                <StatCard :stat="stat" v-model="stat.value" :points-left="character.statPointsLeft" />
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
                                empty-text="Every category added" @select="character.addCategory($event.entry)" />
                        </div>

                        <div class="accordion mb-3">
                            <AccordionPanel v-for="category in character.skillCategories.items" :key="category.id"
                                :id="'skill-' + category.id" :title="category.name">
                                <!-- One menu per category: add a skill, or drop the lot -->
                                <template #menu>
                                    <ActionMenu :label="'Actions for ' + category.name" :items="skillCategoryMenu(category)"
                                        @select="pickFromCategory(category, $event)" />
                                </template>

                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                    <div class="col" v-for="skill in category.items" :key="skill.id">
                                        <SkillCard :skill="skill" v-model="skill.value" @remove="category.remove(skill)" />
                                    </div>
                                </div>
                                <p class="text-body-secondary mb-0" v-if="category.count === 0">
                                    No skills here yet. Use this category's menu to add one.
                                </p>
                            </AccordionPanel>

                            <p class="text-body-secondary mb-0" v-if="character.skillCategories.count === 0">
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
                                    <span class="badge bg-primary">Level {{ character.level }}</span>
                                    <span class="badge bg-secondary text-dark">Earned {{ character.featsEarned }}</span>
                                    <span class="badge bg-success">Bonus {{ character.featsBonus }}</span>
                                    <BudgetBadge :left="character.featsLeft">{{ character.feats.count }} / {{ character.featAllowance }}</BudgetBadge>

                                    <div class="d-flex align-items-center gap-2 ms-auto">
                                        <label for="featCount" class="form-label mb-0">Total</label>
                                        <input type="number" class="form-control" id="featCount"
                                            v-model.number="character.featAllowance" :min="character.featsEarned" max="20" step="1"
                                            aria-describedby="featCountHelp">
                                    </div>
                                </div>
                                <div id="featCountHelp" class="form-text mb-3">
                                    One feat every {{ featsPerLevel }} levels. You may take more, never fewer.
                                </div>

                                <EntryPanel title="Current Feats" :entries="character.feats.items" :add-items="featMenu" add-label="Add feat"
                                    add-empty-text="" empty-text="No feats yet. Use the + beside the heading."
                                    :badges-for="featBadges" @add="character.addFeat($event)" @remove="character.feats.remove($event)" />
                            </AccordionPanel>
                        </div>

                        <!-- Abilities. The same categories and skills as the Skills
                            step: one list, two views, so they can't disagree. -->
                        <div class="accordion mb-3">
                            <AccordionPanel v-for="category in character.skillCategories.items" :key="category.id"
                                :id="'ability-' + category.id" :title="category.name">
                                <template v-for="skill in category.items" :key="skill.id">
                                    <h6 class="fw-bold">{{ skill.name }}</h6>

                                    <div class="d-flex flex-wrap gap-2 mb-3" role="group" :aria-label="skill.name + ' abilities'">
                                        <span class="d-inline-flex align-items-center gap-1" v-for="ability in skill.abilities"
                                            :key="ability.id">
                                            <ToggleButton :id="'ability-' + ability.id" :checked="character.isLearned(ability)"
                                                :disabled="!character.isLearned(ability) && !character.canLearn(skill, ability)"
                                                :tooltip="abilityTitle(skill, ability)" @toggle="character.toggleAbility(skill, ability)">
                                                {{ ability.name }}</ToggleButton>
                                            <ActionMenu :label="'Actions for ' + ability.name" :items="abilityMenu" />
                                        </span>

                                        <span class="text-body-secondary" v-if="skill.abilities.length === 0">
                                            No abilities for this skill yet.
                                        </span>
                                    </div>
                                </template>

                                <p class="text-body-secondary mb-0" v-if="category.count === 0">
                                    No skills in this category. Add one on the Skills step.
                                </p>
                            </AccordionPanel>

                            <p class="text-body-secondary mb-0" v-if="character.skillCategories.count === 0">
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
                                <BudgetBadge :left="character.spellsLeft">{{ character.learnedSpells.length }} / {{ character.spellsKnown }}</BudgetBadge></span>
                        </div>

                        <div class="accordion mb-3">
                            <AccordionPanel v-for="school in character.spellSchools" :key="school.id" :id="'spell-' + school.id"
                                :title="school.name">
                                <template #menu>
                                    <ActionMenu variant="add" :label="'Add a spell to ' + school.name" :items="spellMenu(school)"
                                        empty-text="Nothing left to add" @select="character.addSpell(school, $event.entry)" />
                                </template>

                                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                    <div class="col" v-for="spell in school.items" :key="spell.id">
                                        <SpellCard :spell="spell" :learned="character.isSpellLearned(spell)" :book-full="character.spellsLeft <= 0"
                                            @toggle="character.toggleSpell(spell)" @remove="character.removeSpell(school, spell)" />
                                    </div>

                                    <div class="col" v-if="school.count === 0">
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

                                        <div class="mb-3" v-for="slot in character.inventory.gearSlots" :key="slot.id">
                                            <label :for="slot.id" class="form-label fw-semibold">{{ slot.label }}</label>
                                            <select class="form-select" :id="slot.id" :value="slot.equipped"
                                                @change="character.inventory.equip(slot, $event.target.value)">
                                                <option value="">&mdash; Empty &mdash;</option>
                                                <option v-for="item in character.inventory.equippableIn(slot)" :key="item.id" :value="item.id">
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
                                        <EntryPanel variant="card" title="Inventory" :entries="character.inventory.items" :add-items="itemMenu"
                                            add-label="Add item" add-empty-text="Carrying everything there is"
                                            empty-text="Carrying nothing. Use the + beside the heading."
                                            :badges-for="itemBadges" @add="character.addItem($event)" @remove="character.inventory.remove($event)">
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
