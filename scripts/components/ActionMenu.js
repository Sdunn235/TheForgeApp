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
            },
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        // Each entry: { label, href }. More kinds get added as pages need them.
        items: { type: Array, required: true },
        label: { type: String, required: true },
        variant: {
            type: String,
            default: 'kebab',
            // Catches a typo like variant="buton" with a console warning
            validator: function (value) {
                return ['button', 'kebab'].includes(value);
            },
        },
    },

    // computed:    The look for whichever variant the parent picked.
    computed: {
        look: function () {
            return this.variants[this.variant];
        },
    },

    // template:    This component's HTML.
    template: `
        <div class="dropdown">
            <button type="button" :class="look.buttonClass" data-bs-toggle="dropdown" aria-expanded="false"
                :aria-label="look.icon ? label : null">
                <i v-if="look.icon" :class="look.icon"></i>
                <template v-else>{{ label }}</template>
            </button>
            <ul class="dropdown-menu" :class="look.menuClass">
                <li v-for="item in items" :key="item.label">
                    <a class="dropdown-item" :href="item.href">{{ item.label }}</a>
                </li>
            </ul>
        </div>
    `,
};

export default ActionMenu;