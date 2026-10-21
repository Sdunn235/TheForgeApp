// One dropdown for the whole app: the forge buttons on the home page, the
// + and ⋮ menus on the forge, the ⋮ on each roster card. The page picks a
// variant; this component owns what each variant looks like.
const ActionMenu = {
    // data:    The looks this menu can take. Only this component uses them,
    //          so they live here rather than in the page.
    data: function () {
        return {
            variants: {
                // A full-width button with text, like the home page cards
                button: {
                    buttonClass: 'btn btn-primary dropdown-toggle',
                    menuClass: 'dropdown-menu-lg-end',
                    icon: '',
                },
                // The small ⋮ in a card's corner. Icon only, so label
                // becomes what a screen reader says instead.
                kebab: {
                    buttonClass: 'btn btn-outline-primary btn-kebab',
                    menuClass: 'dropdown-menu-end',
                    icon: 'bi bi-three-dots-vertical',
                },
                // The + beside a heading: "add one of these"
                add: {
                    buttonClass: 'btn btn-outline-primary btn-kebab',
                    menuClass: 'add-skill-menu',
                    icon: 'bi bi-plus-lg',
                },
            },
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        // Each entry is ONE of these:
        //   { label, href?, icon?, danger? }  a choice: a link if it has href,
        //                                     otherwise a button that emits "select"
        //   { header: 'Text' }                a grey heading
        //   { divider: true }                 a line between groups
        //   { note: 'Text' }                  grey text that can't be clicked
        items: { type: Array, required: true },
        label: { type: String, required: true },
        variant: {
            type: String,
            default: 'kebab',
            // Catches a typo like variant="buton" with a console warning
            validator: function (value) {
                return ['button', 'kebab', 'add'].includes(value);
            },
        },
        // Shown when there is nothing left to pick (only headers, or nothing)
        emptyText: { type: String, default: '' },
    },

    // emits:   "select" - a button item was clicked. The menu does not know
    //          what Remove or Edit means; the parent does.
    emits: ['select'],

    // computed:    The look for whichever variant the parent picked, and
    //              whether any item is an actual choice.
    computed: {
        look: function () {
            return this.variants[this.variant];
        },
        hasChoices: function () {
            return this.items.some((item) => item.label !== undefined);
        },
    },

    // template:    One <li> per item. The v-if chain picks what that item
    //              is: a heading, a line, a note, a link, or a button.
    template: `
        <div class="dropdown">
            <button type="button" :class="look.buttonClass" data-bs-toggle="dropdown" aria-expanded="false"
                :aria-label="look.icon ? label : null">
                <i v-if="look.icon" :class="look.icon"></i>
                <template v-else>{{ label }}</template>
            </button>
            <ul class="dropdown-menu" :class="look.menuClass">
                <li v-for="(item, index) in items" :key="index">
                    <h6 v-if="item.header" class="dropdown-header">{{ item.header }}</h6>
                    <hr v-else-if="item.divider" class="dropdown-divider">
                    <span v-else-if="item.note" class="dropdown-item-text text-body-secondary">{{ item.note }}</span>
                    <a v-else-if="item.href" class="dropdown-item" :class="{ 'text-danger': item.danger }"
                        :href="item.href">
                        <i v-if="item.icon" class="me-2" :class="item.icon"></i>{{ item.label }}
                    </a>
                    <button v-else type="button" class="dropdown-item" :class="{ 'text-danger': item.danger }"
                        @click="$emit('select', item)">
                        <i v-if="item.icon" class="me-2" :class="item.icon"></i>{{ item.label }}
                    </button>
                </li>
                <li v-if="!hasChoices && emptyText">
                    <span class="dropdown-item-text text-body-secondary">{{ emptyText }}</span>
                </li>
            </ul>
        </div>
    `,
};

export default ActionMenu;
