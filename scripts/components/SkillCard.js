import ActionMenu from './ActionMenu.js';
import AppCard from './AppCard.js';
import RangeSlider from './RangeSlider.js';

// One skill the character has: its card, its slider, and its ⋮ menu.
// The page owns the value and the list; SkillCard reports changes and
// asks to be removed. It never touches the list itself.
const SkillCard = {
    // components:  The pieces this card is built from.
    components: {
        ActionMenu,
        AppCard,
        RangeSlider,
    },

    // data:    The ⋮ menu's choices. Only this card uses them, so they
    //          live here. "action" is ours; ActionMenu hands it back untouched.
    data: function () {
        return {
            menuItems: [
                // Goes to the design page for this skill once that page exists
                { action: 'edit', label: 'Edit', href: '#', icon: 'bi bi-pencil-square' },
                { action: 'remove', label: 'Remove', icon: 'bi bi-trash', danger: true },
            ],
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    //          skill       = id, name, description, min, max
    //          modelValue  = the skill's current value (filled by v-model)
    props: {
        skill: { type: Object, required: true },
        modelValue: { type: Number, required: true },
    },

    // emits:   update:modelValue - the slider moved
    //          remove            - the player picked Remove from the menu
    emits: ['update:modelValue', 'remove'],

    // computed:    What a screen reader says for the icon-only ⋮ button.
    computed: {
        menuLabel: function () {
            return 'Actions for ' + this.skill.name;
        },
    },

    // methods:     ActionMenu says which item was picked; this card decides
    //              what that means and passes it up to the page.
    methods: {
        onSelect: function (item) {
            if (item.action === 'remove') {
                this.$emit('remove');
            }
        },
    },

    // template:    AppCard is the frame. The menu goes in its #menu corner,
    //              the slider in its default slot.
    template: `
        <app-card :title="skill.name" :description="skill.description">
            <template #menu>
                <action-menu :items="menuItems" :label="menuLabel" @select="onSelect"></action-menu>
            </template>
            <range-slider :id="skill.id" :label="skill.name" variant="card"
                :min="skill.min" :max="skill.max"
                :model-value="modelValue"
                @update:model-value="$emit('update:modelValue', $event)"></range-slider>
        </app-card>
    `,
};

export default SkillCard;
