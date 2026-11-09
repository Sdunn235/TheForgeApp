<script>
import RangeSlider from '@/components/molecules/RangeSlider.vue';
import ActionMenu from '@/components/molecules/ActionMenu.vue';
import AppCard from '@/components/molecules/AppCard.vue';
import PageContentHeader from '@/components/molecules/PageContentHeader.vue';
import StatCard from '@/components/molecules/StatCard.vue';
import SkillCard from '@/components/molecules/SkillCard.vue';
import EntryRow from '@/components/molecules/EntryRow.vue';
import ConfirmModal from '@/components/molecules/ConfirmModal.vue';
import EntryPanel from '@/components/organisms/EntryPanel.vue';
import { startingStats } from '@/data/character.js';
import { skillCatalog } from '@/data/skills.js';
import { effectCatalog } from '@/data/effects.js';
import { spellCatalog } from '@/data/spells.js';
import { featCatalog, featKinds, featSources } from '@/data/feats.js';
import { addMenu } from '@/helpers/menus.js';
import { findById, removeFrom } from '@/helpers/lists.js';
import Collection from '@/models/Collection.js';
import Stat from '@/models/Stat.js';
import Skill from '@/models/Skill.js';
import Spell from '@/models/Spell.js';
import Feat from '@/models/Feat.js';
import Effect from '@/models/Effect.js';
import AccordionPanel from '@/components/molecules/AccordionPanel.vue';
import StepNav from '@/components/molecules/StepNav.vue';
import ChoiceGroup from '@/components/molecules/ChoiceGroup.vue';
import BudgetBadge from '@/components/atoms/BudgetBadge.vue';
import ToggleButton from '@/components/atoms/ToggleButton.vue';
import SpellCard from '@/components/molecules/SpellCard.vue';

// The component gallery (/gallery): each component on its own with sample
// props, in atomic order (atoms, molecules, organisms), so each can be seen
// and tested apart from the pages that use it.
// "Last event" at the top shows every emit that reaches this page.
export default {
    components: {
        RangeSlider,
        ActionMenu,
        AppCard,
        PageContentHeader,
        StatCard,
        SkillCard,
        EntryRow,
        ConfirmModal,
        EntryPanel,
        BudgetBadge,
        ToggleButton,
        SpellCard,
        AccordionPanel,
        StepNav,
        ChoiceGroup,
    },
    data: function () {
        return {
            budgetLeft: 2,
            learned: false,
            lastEvent: 'Nothing yet',
            level: 12,
            hp: 30,
            strength: 8,
            // Model objects, built from the catalogs the same way the forge
            // builds them. Each one is a copy, never the catalog entry itself.
            stats: startingStats.slice(0, 2).map((stat) => new Stat(stat)),
            statPool: 10,
            skill: new Skill(skillCatalog[0].skills[0], 40),
            // Collections: they do their own add, remove and "not owned yet"
            buffs: new Collection(),
            // Three illusion spells, and a spellbook that holds 1
            spells: spellCatalog[5].spells.slice(0, 3).map((spell) => new Spell(spell)),
            learnedSpells: [],
            bookSize: 1,
            feats: new Collection([new Feat(featCatalog[1], 'earned')]),
            named: false,
            typeFilter: 'all',
            typeFilters: [
                { id: 'all', label: 'All' },
                { id: 'player', label: 'Players' },
                { id: 'npc', label: 'NPCs' },
            ],
            sort: 'name',
            sorts: [
                { id: 'name', label: 'Name' },
                { id: 'level', label: 'Level' },
                { id: 'newest', label: 'Newest' },
            ],
            homeLinks: [
                { label: 'A link', href: '#' },
                { label: 'Another link', href: '#' },
            ],
            rowMenu: [
                { action: 'edit', label: 'Edit', href: '#', icon: 'bi bi-pencil-square' },
                { action: 'remove', label: 'Remove', icon: 'bi bi-trash', danger: true },
            ],
            addItems: [
                { header: 'First group' },
                { label: 'Choice one' },
                { label: 'Choice two' },
                { divider: true },
                { header: 'Second group' },
                { note: 'Nothing left here' },
            ],
            sampleRow: { id: 'blessed', name: 'Blessed', description: 'Hover me: the row has a tooltip.' },
        };
    },
    computed: {
        // The shared pool the two StatCards draw from
        statPointsLeft: function () {
            let spent = 0;

            for (const stat of this.stats) {
                spent += stat.spent;
            }

            return this.statPool - spent;
        },
        buffMenu: function () {
            const buffs = effectCatalog.filter((entry) => entry.kind === 'buff');

            return addMenu('Add a buff', this.buffs.missingFrom(buffs));
        },
        featMenu: function () {
            return addMenu('Add a feat', this.feats.missingFrom(featCatalog));
        },
    },
    methods: {
        log: function (text) {
            this.lastEvent = text;
        },
        buffBadges: function (effect) {
            return [
                { tag: 'Buff', badgeClass: 'bg-buff' },
                { tag: effect.duration, badgeClass: 'bg-secondary text-dark rounded-pill' },
            ];
        },
        addBuff: function (catalogEffect) {
            this.buffs.add(new Effect(catalogEffect));
            this.log('EntryPanel emitted add: ' + catalogEffect.name);
        },
        removeBuff: function (effect) {
            this.buffs.remove(effect);
            this.log('EntryPanel emitted remove: ' + effect.name);
        },
        toggleSpell: function (spell) {
            if (this.learnedSpells.includes(spell.id)) {
                removeFrom(this.learnedSpells, spell.id);
            } else {
                this.learnedSpells.push(spell.id);
            }

            this.log('SpellCard emitted toggle: ' + spell.name);
        },
        featBadges: function (feat) {
            return [findById(featKinds, feat.kind), findById(featSources, feat.source)];
        },
        addFeat: function (catalogFeat) {
            this.feats.add(new Feat(catalogFeat, 'earned'));
            this.log('Feats panel emitted add: ' + catalogFeat.name);
        },
        removeFeat: function (feat) {
            this.feats.remove(feat);
            this.log('Feats panel emitted remove: ' + feat.name);
        },
        removeSpell: function (spell) {
            removeFrom(this.spells, spell);
            removeFrom(this.learnedSpells, spell.id);
            this.log('SpellCard emitted remove: ' + spell.name);
        },
    },
};
</script>

<template>

    <div class="container mt-5 pt-5 mb-5">
        <h1 class="display-5">Component gallery</h1>
        <p class="alert alert-secondary">Last event: <strong>{{ lastEvent }}</strong></p>

        <!-- ================= ATOMS ================= -->
        <h2 class="mt-4">Atoms</h2>

        <h3 class="h5 mt-4">BudgetBadge: red below 0, amber at 0, blue above</h3>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <button type="button" class="btn btn-outline-primary" @click="budgetLeft--">−</button>
            <BudgetBadge :left="budgetLeft" />
            <button type="button" class="btn btn-outline-primary" @click="budgetLeft++">+</button>
            <BudgetBadge :left="budgetLeft">{{ 4 - budgetLeft }} / 4 (slot text)</BudgetBadge>
        </div>

        <h3 class="h5 mt-4">ToggleButton: available, on, blocked, small</h3>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <ToggleButton id="galleryToggle" :checked="learned" tooltip="Click me"
                @toggle="learned = !learned; log('ToggleButton emitted toggle')">Rich Veins</ToggleButton>
            <ToggleButton id="galleryBlocked" disabled tooltip="Needs Mining 25">Steady Pick</ToggleButton>
            <ToggleButton id="gallerySmall" small :checked="learned" @toggle="learned = !learned">Learn</ToggleButton>
        </div>
        <p>In the parent: learned = {{ learned }}</p>

        <!-- ================= MOLECULES ================= -->
        <h2 class="mt-4">Molecules</h2>

        <h3 class="h5 mt-4">RangeSlider: the three looks</h3>
        <div class="card">
            <div class="card-body">
                <RangeSlider id="galleryLevel" label="Level" variant="level" :min="1" :max="50" v-model="level"
                    tooltip="Hover text works" show-max />
                <RangeSlider id="galleryHp" label="HP" variant="vital" :min="0" :max="66" v-model="hp"
                    fill-class="range-health" tooltip="HP = Constitution × 3 + Level × 2" show-max />
                <RangeSlider id="galleryStrength" label="Strength" variant="card" :min="1" :max="20" :cap="12"
                    v-model="strength" />
                <p class="mb-0">In the parent: level {{ level }}, HP {{ hp }}, strength {{ strength }} (capped at 12)
                </p>
            </div>
        </div>

        <h3 class="h5 mt-4">ActionMenu: button, kebab (⋮), add (+)</h3>
        <div class="d-flex flex-wrap align-items-center gap-3">
            <ActionMenu variant="button" label="Button look" :items="homeLinks" />
            <ActionMenu label="Kebab look" :items="rowMenu"
                @select="log('ActionMenu emitted select: ' + $event.label)" />
            <ActionMenu variant="add" label="Add look" :items="addItems"
                @select="log('ActionMenu emitted select: ' + $event.label)" />
            <ActionMenu variant="add" label="Empty add menu" :items="[{ header: 'Nothing to pick' }]"
                empty-text="Every category added" />
        </div>

        <h3 class="h5 mt-4">AppCard: image, description, #menu and #footer slots</h3>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div class="col">
                <AppCard title="A card" description="The description prop." image="/images/anvil.png"
                    image-alt="Hammer and anvil">
                    <template #menu>
                        <ActionMenu label="Card actions" :items="rowMenu"
                            @select="log('Card menu emitted select: ' + $event.label)" />
                    </template>
                    <p class="mb-0">The default slot.</p>
                    <template #footer>
                        <button type="button" class="btn btn-primary w-100">The #footer slot</button>
                    </template>
                </AppCard>
            </div>
        </div>

        <h3 class="h5 mt-4">PageContentHeader</h3>
        <PageContentHeader title="A Page Title" description="The lavender banner, with its description." />

        <h3 class="h5 mt-4">StatCard ×2: one shared pool of {{ statPool }} (left: {{ statPointsLeft }})</h3>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div class="col" v-for="stat in stats" :key="stat.id">
                <StatCard :stat="stat" v-model="stat.value" :points-left="statPointsLeft" />
            </div>
        </div>

        <h3 class="h5 mt-4">SkillCard</h3>
        <div class="row row-cols-1 row-cols-md-2 g-3">
            <div class="col">
                <SkillCard :skill="skill" v-model="skill.value" @remove="log('SkillCard emitted remove')" />
            </div>
        </div>
        <p>In the parent: {{ skill.name }} = {{ skill.value }}</p>

        <h3 class="h5 mt-4">SpellCard ×3: the spellbook holds {{ bookSize }}</h3>
        <div class="row row-cols-1 row-cols-md-3 g-3">
            <div class="col" v-for="spell in spells" :key="spell.id">
                <SpellCard :spell="spell" :learned="learnedSpells.includes(spell.id)"
                    :book-full="learnedSpells.length >= bookSize" @toggle="toggleSpell(spell)"
                    @remove="removeSpell(spell)" />
            </div>
        </div>

        <h3 class="h5 mt-4">AccordionPanel ×3: with a menu, without, and the new Feats layout</h3>
        <div class="accordion">
            <AccordionPanel id="gallery-gathering" title="Gathering Skills">
                <template #menu>
                    <ActionMenu label="Actions for Gathering Skills" :items="rowMenu"
                        @select="log('Panel menu emitted select: ' + $event.label)" />
                </template>
                <p class="mb-0">A panel with a ⋮ beside its header (Skills, Spells).</p>
            </AccordionPanel>

            <AccordionPanel id="gallery-plain" title="One-Handed Weapons">
                <p class="mb-0">A panel with no menu (Abilities).</p>
            </AccordionPanel>

            <AccordionPanel id="gallery-feats" title="Feats">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span class="badge bg-primary">Level 12</span>
                    <BudgetBadge :left="3 - feats.count">{{ feats.count }} / 3</BudgetBadge>
                </div>
                <EntryPanel title="Current Feats" :entries="feats.items" :add-items="featMenu" add-label="Add feat"
                    empty-text="No feats yet. Use the + beside the heading." :badges-for="featBadges"
                    @add="addFeat" @remove="removeFeat" />
            </AccordionPanel>
        </div>

        <h3 class="h5 mt-4">StepNav ×2: a first step, and any other step</h3>
        <form @submit.prevent="log('Form submitted')">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="galleryNamed" v-model="named">
                <label class="form-check-label" for="galleryNamed">The character has a name (unlocks Save Info)</label>
            </div>
            <StepNav save-label="Save Info" first :save-disabled="!named" />
            <StepNav save-label="Save Stats" @back="log('StepNav emitted back')" />
        </form>

        <h3 class="h5 mt-4">ChoiceGroup ×2: two groups on one page</h3>
        <div class="row g-3">
            <div class="col-12 col-md-6">
                <ChoiceGroup name="galleryType" label="Filter by character type" :options="typeFilters"
                    v-model="typeFilter" />
                <p class="mb-0">In the parent: {{ typeFilter }}</p>
            </div>
            <div class="col-12 col-md-6">
                <ChoiceGroup name="gallerySort" label="Sort the roster" :options="sorts" v-model="sort" />
                <p class="mb-0">In the parent: {{ sort }}</p>
            </div>
        </div>

        <h3 class="h5 mt-4">EntryRow</h3>
        <ul class="list-group">
            <EntryRow :entry="sampleRow" :badges="[{ tag: 'Buff', badgeClass: 'bg-buff' }]"
                @remove="log('EntryRow emitted remove')" />
        </ul>

        <h3 class="h5 mt-4">ConfirmModal (built on AppModal)</h3>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary" @click="$refs.plainModal.open()">Open plain</button>
            <button type="button" class="btn btn-danger" @click="$refs.dangerModal.open()">Open danger + slot</button>
        </div>
        <ConfirmModal ref="plainModal" id="galleryPlainModal" title="Save This?" message="The message prop."
            confirm-label="Save" cancel-label="Keep Editing" @confirm="log('ConfirmModal emitted confirm')" />
        <ConfirmModal ref="dangerModal" id="galleryDangerModal" title="Delete This?" confirm-label="Delete" danger
            @confirm="log('Danger ConfirmModal emitted confirm')">
            <p class="mb-0">The default slot, with <strong>bold</strong> text a prop can't carry.</p>
        </ConfirmModal>

        <!-- ================= ORGANISMS ================= -->
        <h2 class="mt-5">Organisms</h2>

        <h3 class="h5 mt-4">AppNavbar</h3>
        <p>At the top of every page (and at the bottom, below the lg breakpoint). App.vue draws it once for
            the whole app.</p>

        <h3 class="h5 mt-4">EntryPanel: add and remove for real</h3>
        <div class="card">
            <div class="card-body">
                <EntryPanel title="Buffs" :entries="buffs.items" :add-items="buffMenu" add-label="Add a buff"
                    empty-text="No buffs active." count-class="bg-buff" :badges-for="buffBadges" @add="addBuff"
                    @remove="removeBuff" />
            </div>
        </div>
    </div>
</template>
