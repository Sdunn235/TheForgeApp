<script>
import ActionMenu from '@/components/molecules/ActionMenu.vue';
import ChoiceGroup from '@/components/molecules/ChoiceGroup.vue';
import ConfirmModal from '@/components/molecules/ConfirmModal.vue';
import FilterChip from '@/components/atoms/FilterChip.vue';
import vTooltip from '@/directives/tooltip.js';
import Player from '@/models/Player.js';
import Npc from '@/models/Npc.js';
import { npcTypes } from '@/data/character.js';
import { findById, removeFrom } from '@/helpers/lists.js';

// The roster page: every saved character, searched, filtered, sorted and
// paged, each with its character sheet. The roster is a Roster collection
// (models/Roster.js) owned by App.vue; it does the searching and sorting,
// and each Player or Npc answers for its own facts. This page only decides
// what is shown, and in what colours.
export default {
    components: {
        ActionMenu,
        ChoiceGroup,
        ConfirmModal,
        FilterChip,
    },
    directives: {
        tooltip: vTooltip,
    },

    // inject:  Takes what App.vue's provide hands down. roster is read here;
    //          deleting goes back through App, which owns the roster.
    inject: ['roster', 'deleteFromRoster'],

    // data:    This page's own state and wording.
    data: function () {
        return {
            // The type ids, from the classes, so 'npc' is never typed here
            types: {
                player: Player.type,
                npc: Npc.type,
            },

            // Which field the search box looks at, and what it is looking for
            searchField: 'name',
            searchFields: [
                { id: 'name', label: 'Name' },
                { id: 'userId', label: 'User ID' },
            ],
            searchTerm: '',

            typeFilter: 'all',
            typeFilters: [
                { id: 'all', label: 'All' },
                { id: Player.type, label: 'Players' },
                { id: Npc.type, label: 'NPCs' },
            ],

            // Narrows NPCs to one creature type. Only shown when NPCs is picked.
            creatureFilter: 'all',
            npcTypes: npcTypes,

            // Sort order, as buttons rather than a dropdown, so the current
            // order is readable without opening anything
            sort: 'name',
            sorts: [
                { id: 'name', label: 'Name' },
                { id: 'level', label: 'Level' },
                { id: 'newest', label: 'Newest' },
            ],

            // Paging. Four per page, so the 14 samples fill four pages.
            page: 1,
            pageSize: 4,

            // Characters pinned to the top so they stay on screen while you
            // search for another. Ids, not objects: saving an edit replaces
            // the character object, but its id stays the same.
            lockedIds: [],

            // The character the delete pop-up is asking about. One pop-up
            // serves every card, so it has to be told which one.
            pendingDelete: null,
            deleteConfirm: {
                id: 'deleteCharacterModal',
                title: 'Delete Character?',
                message: 'Stats, skills, abilities, spells, and items go with it. This cannot be undone.',
                confirmLabel: 'Delete Character',
            },

            // The model knows the HP / MP / SP numbers; the colours are this
            // page's business (MVVM). Bootstrap builds these classes from the
            // $forge-colors map in _tools.scss.
            vitalBadges: {
                hp: 'text-bg-health',
                mp: 'text-bg-mana',
                sp: 'text-bg-stamina',
            },

            // The type badge's colour, by type id. Colours are this page's
            // business, so this was "isNpc ? ... : ..." in the template.
            typeBadges: {
                [Player.type]: 'bg-primary',
                [Npc.type]: 'bg-secondary text-dark',
            },
        };
    },

    computed: {
        // Locked characters, pinned above the search results
        lockedCharacters: function () {
            return this.roster.filter((character) => this.lockedIds.includes(character.id));
        },

        // The roster after the search box and the filters have had their say.
        // The Roster does the work (models/Roster.js search); this page only
        // says what is in the boxes. Locked characters are shown separately,
        // so they are left out rather than appearing twice.
        filteredRoster: function () {
            return this.roster.search({
                type: this.typeFilter,
                creature: this.creatureFilter,
                field: this.searchField,
                term: this.searchTerm,
                exclude: this.lockedIds,
                sort: this.sort,
            });
        },

        // At least one page, even when the list is empty, so nothing ever
        // reads "Page 1 of 0"
        pageCount: function () {
            return Math.max(1, Math.ceil(this.filteredRoster.length / this.pageSize));
        },

        pageNumbers: function () {
            const numbers = [];

            for (let number = 1; number <= this.pageCount; number++) {
                numbers.push(number);
            }

            return numbers;
        },

        // The slice actually shown. It clamps rather than trusting page,
        // because a filter can shrink the list under your feet.
        pagedRoster: function () {
            const current = Math.min(this.page, this.pageCount);
            const start = (current - 1) * this.pageSize;

            return this.filteredRoster.slice(start, start + this.pageSize);
        },

        // What the list draws: everything locked, then the current page.
        // Same list, so the character sheet is written once for both.
        visibleRoster: function () {
            return this.lockedCharacters.concat(this.pagedRoster);
        },

        // What the search chip says, or '' for no chip at all
        searchChip: function () {
            const term = this.searchTerm.trim();

            if (term === '') {
                return '';
            }

            const field = findById(this.searchFields, this.searchField);

            return (field === undefined ? 'Name' : field.label) + ' contains "' + term + '"';
        },

        typeChip: function () {
            const filter = findById(this.typeFilters, this.typeFilter);

            return 'Type: ' + (filter === undefined ? 'All' : filter.label);
        },

        // The creature menu's button text: what is picked right now
        creatureLabel: function () {
            const kind = findById(this.npcTypes, this.creatureFilter);

            return kind === undefined ? 'All creature types' : kind.label;
        },
    },

    methods: {
        goToPage: function (number) {
            this.page = Math.min(Math.max(number, 1), this.pageCount);
        },

        isLocked: function (character) {
            return this.lockedIds.includes(character.id);
        },

        toggleLock: function (character) {
            if (this.isLocked(character)) {
                removeFrom(this.lockedIds, character.id);
            } else {
                this.lockedIds.push(character.id);
            }
        },

        // A card's ⋮. A method, because Edit's link and the lock's wording
        // differ for each character. Edit is a router link: the forge reads
        // the id from the address (?id=3).
        cardMenu: function (character) {
            const locked = this.isLocked(character);

            return [
                { action: 'edit', label: 'Edit in the forge', to: { name: 'forge', query: { id: character.id } }, icon: 'bi bi-pencil-square' },
                { action: 'lock', label: locked ? 'Release lock' : 'Lock for comparison', icon: locked ? 'bi bi-unlock' : 'bi bi-lock' },
                { action: 'download', label: 'Download JSON', icon: 'bi bi-download' },
                { divider: true },
                { action: 'delete', label: 'Delete', icon: 'bi bi-trash', danger: true },
            ];
        },

        // What a pick from that menu means. Edit is a link, so it never lands here.
        pickFromCard: function (character, item) {
            if (item.action === 'lock') {
                this.toggleLock(character);
            } else if (item.action === 'download') {
                this.downloadCharacter(character);
            } else if (item.action === 'delete') {
                this.askDelete(character);
            }
        },

        // A locked card is outlined, so it reads as pinned rather than as
        // just the first result
        cardClass: function (character) {
            return this.isLocked(character) ? 'border-primary border-2' : '';
        },

        // Each sheet needs its own id for Bootstrap's collapse
        sheetId: function (character) {
            return 'sheet-' + character.id;
        },

        // Save one character to a file. JSON.stringify writes what the
        // character's toJSON hands it (models/Character.js): plain fields,
        // no getters, lists as plain arrays. The temporary link is the
        // question for the teacher (B-18).
        downloadCharacter: function (character) {
            const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = character.name.replace(/[^a-zA-Z0-9_-]+/g, '-') + '.json';
            link.click();

            URL.revokeObjectURL(url);
        },

        // Point the one delete pop-up at a character, then open it
        askDelete: function (character) {
            this.pendingDelete = character;
            this.$refs.deleteModal.open();
        },

        // App owns the roster, so App removes the character; the list on
        // this page is computed from the roster, so it follows by itself
        confirmDelete: function () {
            if (this.pendingDelete === null) {
                return;
            }

            this.deleteFromRoster(this.pendingDelete);
            removeFrom(this.lockedIds, this.pendingDelete.id);
            this.pendingDelete = null;
        },
    },

    // watch:   A narrowing search or filter can leave you on a page that no
    //          longer exists, so each one goes back to page 1.
    watch: {
        searchTerm: function () {
            this.page = 1;
        },
        // Leaving NPCs clears the creature type, or a hidden "Beast" filter
        // would quietly hide every player
        typeFilter: function () {
            this.page = 1;
            this.creatureFilter = 'all';
        },
        creatureFilter: function () {
            this.page = 1;
        },
    },
};
</script>

<template>
    <div class="container text-start mt-5 pt-5">
        <!-- Search, filter, add -->
        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">Search the Roster</h3>
                <p class="mb-4 text-body-secondary">Pick a field, type what you are looking for, and narrow the list
                    by character type.</p>

                <!-- No submit handler: the list is computed, so it narrows as
                    you type and there is nothing to submit -->
                <form role="search" @submit.prevent>
                    <div class="row g-3 align-items-end mb-3">
                        <div class="col-12 col-lg-9">
                            <label for="rosterSearch" class="form-label">Find a Character</label>
                            <div class="input-group">
                                <label class="visually-hidden" for="rosterSearchField">Search field</label>
                                <select class="form-select flex-grow-0 w-auto" id="rosterSearchField" v-model="searchField">
                                    <option v-for="field in searchFields" :key="field.id" :value="field.id">{{ field.label }}
                                    </option>
                                </select>
                                <input type="search" class="form-control" id="rosterSearch" placeholder="Search the roster..."
                                    aria-label="Search the roster" v-model="searchTerm">
                            </div>
                        </div>

                        <div class="col-12 col-lg-3">
                            <RouterLink :to="{ name: 'forge' }" class="btn btn-primary w-100"
                                v-tooltip="'Open the forge and build a new character'">
                                <i class="bi bi-plus-lg"></i> Forge New Character
                            </RouterLink>
                        </div>
                    </div>

                    <div class="row g-3 align-items-start">
                        <div class="col-12 col-md-6">
                            <span class="form-label d-block">Character Type</span>
                            <ChoiceGroup name="typeFilter" label="Filter by character type" :options="typeFilters"
                                v-model="typeFilter" />

                            <!-- A plain dropdown, not an ActionMenu: it shows the current pick -->
                            <div class="dropdown mt-2" v-if="typeFilter === types.npc">
                                <button class="btn btn-outline-primary dropdown-toggle w-100" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">{{ creatureLabel }}</button>
                                <ul class="dropdown-menu dropdown-menu-scroll">
                                    <li>
                                        <button class="dropdown-item" type="button" :class="{ active: creatureFilter === 'all' }"
                                            @click="creatureFilter = 'all'">All creature types</button>
                                    </li>
                                    <li v-for="kind in npcTypes" :key="kind.id">
                                        <button class="dropdown-item" type="button" :class="{ active: creatureFilter === kind.id }"
                                            @click="creatureFilter = kind.id">{{ kind.label }}</button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <span class="form-label d-block">Sort By</span>
                            <ChoiceGroup name="rosterSort" label="Sort the roster" :options="sorts" v-model="sort" />
                        </div>
                    </div>
                </form>

                <!-- Clearing a chip puts the data back to its start; the list follows -->
                <div class="d-flex gap-2 flex-wrap mt-3">
                    <FilterChip v-if="searchChip !== ''" clear-label="Clear the search" @clear="searchTerm = ''">
                        {{ searchChip }}
                    </FilterChip>
                    <FilterChip v-if="typeFilter !== 'all'" clear-label="Clear the type filter" @clear="typeFilter = 'all'">
                        {{ typeChip }}
                    </FilterChip>
                </div>
            </div>
        </div>

        <!-- The roster itself -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <h3 class="card-title mb-0">Characters</h3>
                    <span class="badge bg-primary rounded-pill">{{ roster.count }}</span>
                </div>

                <div class="alert alert-secondary mb-0" role="status" v-if="roster.count === 0">
                    Nothing forged yet. Build a character and save it, and it will appear here.
                </div>
                <div class="alert alert-secondary mb-0" role="status"
                    v-else-if="filteredRoster.length === 0 && lockedCharacters.length === 0">
                    No character matches that search.
                </div>

                <ul class="list-unstyled mb-0">
                    <li class="card mb-3" :class="cardClass(character)" v-for="character in visibleRoster" :key="character.id">
                        <div class="card-body position-relative">
                            <ActionMenu class="card-kebab" :label="'Actions for ' + character.name"
                                :items="cardMenu(character)" @select="pickFromCard(character, $event)" />

                            <div class="d-flex flex-wrap align-items-center gap-3 pe-5">
                                <img src="/images/anvil.png" :alt="'Portrait of ' + character.name"
                                    class="rounded-circle roster-portrait">
                                <div>
                                    <h5 class="mb-1">
                                        {{ character.name }}
                                        <i class="bi bi-lock-fill text-primary" v-if="isLocked(character)"
                                            v-tooltip="'Locked for comparison'"></i>
                                    </h5>
                                    <span class="badge" :class="typeBadges[character.type]">{{
                                        character.typeLabel }}</span>
                                    <span class="badge bg-secondary text-dark">{{ character.tagLabel }}</span>
                                    <span class="badge bg-success rounded-pill">Level {{ character.level }}</span>
                                    <span class="badge" :class="vitalBadges[vital.id]" v-for="vital in character.vitalBars"
                                        :key="vital.id">{{ vital.label }} {{ vital.value }} / {{ vital.max }}</span>
                                </div>
                            </div>

                            <button class="btn btn-outline-primary mt-3" type="button" data-bs-toggle="collapse"
                                :data-bs-target="'#' + sheetId(character)" aria-expanded="false"
                                :aria-controls="sheetId(character)">
                                <i class="bi bi-chevron-down me-1"></i> Character sheet
                            </button>

                            <div class="collapse mt-3" :id="sheetId(character)">
                                <div class="row row-cols-1 row-cols-lg-2 g-3">
                                    <div class="col">
                                        <h6 class="fw-bold">Attributes</h6>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                                v-for="stat in character.stats" :key="stat.id">
                                                {{ stat.label }}
                                                <span class="badge bg-secondary text-dark">{{ stat.value }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="col">
                                        <h6 class="fw-bold">Gear</h6>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                                v-for="slot in character.gear" :key="slot.id">
                                                {{ slot.label }}
                                                <span class="badge" :class="slot.filled ? 'bg-primary' : 'bg-secondary text-dark'">{{
                                                    slot.itemName }}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="col">
                                        <h6 class="fw-bold">Skills</h6>
                                        <template v-for="category in character.skillCategories.items" :key="category.id">
                                            <p class="fw-semibold mb-1">{{ category.name }}</p>
                                            <ul class="list-group list-group-flush mb-2">
                                                <li class="list-group-item d-flex justify-content-between align-items-center"
                                                    v-for="skill in category.items" :key="skill.id">
                                                    {{ skill.name }}
                                                    <span class="badge bg-secondary text-dark">{{ skill.value }}</span>
                                                </li>
                                            </ul>
                                        </template>
                                        <p class="text-body-secondary mb-0" v-if="character.skillCategories.count === 0">
                                            No skills recorded.</p>
                                    </div>

                                    <div class="col">
                                        <h6 class="fw-bold">Abilities</h6>
                                        <p class="mb-2">
                                            <span class="badge bg-success me-1" v-for="ability in character.abilities"
                                                :key="ability.id">{{ ability.name }}</span>
                                            <span class="text-body-secondary" v-if="character.abilities.length === 0">None
                                                learned.</span>
                                        </p>

                                        <h6 class="fw-bold">Feats</h6>
                                        <p class="mb-0">
                                            <span class="badge bg-primary me-1" v-for="feat in character.feats.items" :key="feat.id">{{
                                                feat.name }}</span>
                                            <span class="text-body-secondary" v-if="character.feats.count === 0">None taken.</span>
                                        </p>
                                    </div>

                                    <div class="col">
                                        <h6 class="fw-bold">Spellbook</h6>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                                v-for="spell in character.spellbook" :key="spell.id">
                                                {{ spell.name }}
                                                <span>
                                                    <span class="badge bg-primary">{{ spell.levelLabel }}</span>
                                                    <span class="badge bg-secondary text-dark">{{ spell.costLabel }}</span>
                                                </span>
                                            </li>
                                        </ul>
                                        <p class="text-body-secondary mb-0" v-if="character.spellbook.length === 0">No spells
                                            learned.</p>
                                    </div>

                                    <div class="col">
                                        <h6 class="fw-bold">Inventory</h6>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                                v-for="item in character.inventory.items" :key="item.id">
                                                <span><span class="badge bg-secondary text-dark me-2">{{ item.qty }}</span>{{
                                                    item.name }}</span>
                                                <span class="badge bg-primary">{{ item.slotLabel }}</span>
                                            </li>
                                        </ul>
                                        <p class="text-body-secondary mb-0" v-if="character.inventory.count === 0">Carrying
                                            nothing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <!-- Paging. The page numbers come from the list's own length,
                    so the pager appears and disappears on its own. -->
                <nav aria-label="Roster pages" class="mt-3" v-if="pageCount > 1">
                    <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: page === 1 }">
                            <button class="page-link" type="button" @click="goToPage(page - 1)">Previous</button>
                        </li>
                        <li class="page-item" v-for="number in pageNumbers" :key="number"
                            :class="{ active: number === page }" :aria-current="number === page ? 'page' : null">
                            <button class="page-link" type="button" @click="goToPage(number)">{{ number }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: page === pageCount }">
                            <button class="page-link" type="button" @click="goToPage(page + 1)">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- One delete pop-up for every card; askDelete points it at a
            character. The bold name fills ConfirmModal's slot. -->
        <ConfirmModal ref="deleteModal" v-bind="deleteConfirm" danger @confirm="confirmDelete">
            <p class="mb-2">
                You are about to permanently delete
                <strong>{{ pendingDelete === null ? 'this character' : pendingDelete.name }}</strong>
                from the world.
            </p>
            <p class="mb-0">{{ deleteConfirm.message }}</p>
        </ConfirmModal>
    </div>
</template>

<style scoped lang="scss">
// Roster portraits. Needs to beat the app-wide .card img rule, which
// stretches an image to the full card width. One knob for the size:
$roster-portrait-size: 4rem;

.card img.roster-portrait {
    // These sit in a flex row beside the name and badges; don't let them shrink
    flex: 0 0 auto;
    width: $roster-portrait-size;
    height: $roster-portrait-size;
    object-fit: cover;
}

// The creature-type menu shows about five choices and scrolls the rest. One
// item is about 2rem at this font size; the extra half shows there is more.
$dropdown-scroll-height: 10.5rem;

.dropdown-menu-scroll {
    max-height: $dropdown-scroll-height;
    overflow-y: auto;
}
</style>
