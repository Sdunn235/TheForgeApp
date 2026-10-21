import ActionMenu from './ActionMenu.js';
import EntryRow from './EntryRow.js';

// A heading with a + menu over a list of rows: Buffs, Debuffs, Feats,
// Inventory. The page owns the list and the catalog; the panel shows them,
// and reports "add this" and "remove that".
const EntryPanel = {
    // components:  The pieces this panel is built from.
    components: {
        ActionMenu,
        EntryRow,
    },

    // data:    The looks this panel can take. compact = a small heading
    //          (Buffs/Debuffs in the Vitals card); card = a card's own title.
    data: function () {
        return {
            variants: {
                compact: { titleClass: 'h6', headerClass: 'mb-2' },
                card: { titleClass: 'card-title h5', headerClass: 'mb-3' },
            },
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        title: { type: String, required: true },
        entries: { type: Array, required: true },
        // The + menu, built by the page with addMenu (header + choices)
        addItems: { type: Array, required: true },
        addLabel: { type: String, required: true },
        emptyText: { type: String, required: true },
        addEmptyText: { type: String, default: 'Nothing left to add' },
        // A count badge beside the title. '' = no count.
        countClass: { type: String, default: '' },
        // A function: give it an entry, get back that entry's badges
        badgesFor: {
            type: Function,
            default: function () {
                return [];
            },
        },
        // A long list scrolls instead of stretching the page
        scroll: { type: Boolean, default: false },
        variant: {
            type: String,
            default: 'compact',
            validator: function (value) {
                return ['compact', 'card'].includes(value);
            },
        },
    },

    // emits:   add    - a catalog entry was picked from the + menu
    //          remove - a row asked to be removed (relayed from EntryRow)
    emits: ['add', 'remove'],

    // computed:    The look for whichever variant the page picked.
    computed: {
        look: function () {
            return this.variants[this.variant];
        },
    },

    // methods:     The + menu sends back its item; the catalog entry rides
    //              inside it, so pass up just the entry.
    methods: {
        onAdd: function (item) {
            this.$emit('add', item.entry);
        },
    },

    // template:    The default slot goes between the heading and the list
    //              (the feat counter). #extra is a scoped slot: each row hands
    //              its own entry back to the page, for inventory's quantity box.
    template: `
        <div>
            <div class="d-flex align-items-center gap-2" :class="look.headerClass">
                <h5 class="mb-0" :class="look.titleClass">{{ title }}</h5>
                <span v-if="countClass" class="badge rounded-pill" :class="countClass">{{ entries.length }}</span>
                <action-menu variant="add" :label="addLabel" :items="addItems" :empty-text="addEmptyText"
                    @select="onAdd"></action-menu>
            </div>

            <slot></slot>

            <div :class="{ 'feat-list': scroll }">
                <ul class="list-group list-group-flush">
                    <entry-row v-for="entry in entries" :key="entry.id" :entry="entry" :badges="badgesFor(entry)"
                        @remove="$emit('remove', entry)">
                        <slot name="extra" :entry="entry"></slot>
                    </entry-row>
                    <li v-if="entries.length === 0" class="list-group-item text-body-secondary">{{ emptyText }}</li>
                </ul>
            </div>
        </div>
    `,
};

export default EntryPanel;
