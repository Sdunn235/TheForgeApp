import ActionMenu from './ActionMenu.js';
import vTooltip from '../directives/tooltip.js';

// One row in an EntryPanel list: a buff, a feat, an item. Shows the name and
// badges, holds the ⋮ menu, and asks to be removed. The page owns the list.
const EntryRow = {
    // components / directives:  What this row is built from.
    components: {
        ActionMenu,
    },
    directives: {
        tooltip: vTooltip,
    },

    // data:    The ⋮ menu's choices. Only this row uses them, so they live
    //          here (the same idea as SkillCard). "action" is ours.
    data: function () {
        return {
            menuItems: [
                // Goes to the design page for this entry once that page exists
                { action: 'edit', label: 'Edit', href: '#', icon: 'bi bi-pencil-square' },
                { action: 'remove', label: 'Remove', icon: 'bi bi-trash', danger: true },
            ],
        };
    },

    // props:   entry  = what this row shows (name, description). Read only.
    //          badges = [{ tag, badgeClass }], worked out by the panel's page
    props: {
        entry: { type: Object, required: true },
        // An Array default has to come from a function, so every row gets
        // its own empty list instead of all of them sharing one.
        badges: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },

    // emits:   remove - the player picked Remove from the ⋮ menu
    emits: ['remove'],

    // computed:    What a screen reader says for the icon-only ⋮ button.
    computed: {
        menuLabel: function () {
            return 'Actions for ' + this.entry.name;
        },
    },

    // methods:     ActionMenu says which item was picked; the row decides
    //              what that means and passes it up.
    methods: {
        onSelect: function (item) {
            if (item.action === 'remove') {
                this.$emit('remove');
            }
        },
    },

    // template:    The default slot is for extras that only some lists have
    //              (inventory's quantity box). It sits before the ⋮.
    template: `
        <li class="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2"
            v-tooltip="entry.description">
            <h6 class="mb-0">{{ entry.name }}</h6>
            <span class="d-flex flex-wrap align-items-center gap-2 ms-auto">
                <span v-for="badge in badges" :key="badge.tag" class="badge" :class="badge.badgeClass">{{ badge.tag }}</span>
                <slot></slot>
                <action-menu :items="menuItems" :label="menuLabel" @select="onSelect"></action-menu>
            </span>
        </li>
    `,
};

export default EntryRow;
