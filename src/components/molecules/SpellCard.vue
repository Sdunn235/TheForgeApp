<script>
import ActionMenu from '@/components/molecules/ActionMenu.vue';
import AppCard from '@/components/molecules/AppCard.vue';
import ToggleButton from '@/components/atoms/ToggleButton.vue';
import Spell from '@/models/Spell.js';

// One spell the character carries: its card, its badges, its ⋮ menu and
// its Learn button. Built like SkillCard: AppCard is the frame, and the
// pieces go in its slots. The page owns the spell list and the spellbook;
// SpellCard shows one spell and reports "learn me" and "remove me".
export default {
    // components:  The pieces this card is built from.
    components: {
        ActionMenu,
        AppCard,
        ToggleButton,
    },

    // data:    The ⋮ menu's choices. Only this card uses them, so they live
    //          here (rule 7). Was spellMenu in app.js.
    data: function () {
        return {
            menuItems: [
                // Goes to the spell's design page once that page exists
                { action: 'edit', label: 'Edit', href: '#', icon: 'bi bi-pencil-square' },
                { action: 'remove', label: 'Remove', icon: 'bi bi-trash', danger: true },
            ],
        };
    },

    // props:   spell    = a Spell (models/Spell.js). Read only. It knows
    //                     how its own level and cost read (levelLabel,
    //                     costLabel), so this card just shows them.
    //          learned  = is it in the spellbook?
    //          bookFull = is the spellbook full? (the page counts, because
    //                     only the page can see every spell)
    props: {
        // type can be a class: Vue then checks the prop is a Spell
        spell: { type: Spell, required: true },
        learned: { type: Boolean, default: false },
        bookFull: { type: Boolean, default: false },
    },

    // emits:   toggle - Learn was clicked (learn it, or forget it)
    //          remove - Remove was picked from the ⋮ menu
    emits: ['toggle', 'remove'],

    // computed:    Everything one card can work out from its own props.
    //              These were methods taking (spell) in app.js; here the
    //              spell is already a prop, so no argument is needed and
    //              they can be computed (the same move as affordableMax).
    computed: {
        menuLabel: function () {
            return 'Actions for ' + this.spell.name;
        },
        // The checkbox's id, so its label can point at it
        toggleId: function () {
            return 'spell-' + this.spell.id;
        },
        // A learned spell can always be clicked, to forget it. One that is
        // not learned can only be clicked if the book has room.
        canToggle: function () {
            return this.learned || !this.bookFull;
        },
        // What the Learn button's tooltip says in each of its three states
        learnTitle: function () {
            if (this.learned) {
                return 'In your spellbook. Click to forget it.';
            }

            if (!this.bookFull) {
                return 'Add to your spellbook.';
            }

            return 'Your spellbook is full. Raise Intelligence or gain a level.';
        },
    },

    // methods:     ActionMenu says which item was picked; the card decides
    //              what that means and passes it up. Edit is a link, so only
    //              Remove lands here.
    methods: {
        onSelect: function (item) {
            if (item.action === 'remove') {
                this.$emit('remove');
            }
        },
    },
};
</script>

<template>
    <!-- No description prop on AppCard: the badges sit ABOVE the description
        on a spell card, so both go in the slot, in that order. -->
    <AppCard :title="spell.name">
        <template #menu>
            <ActionMenu :items="menuItems" :label="menuLabel" @select="onSelect" />
        </template>

        <div class="mb-2">
            <span class="badge bg-primary">{{ spell.levelLabel }}</span>
            <span class="badge bg-secondary text-dark">{{ spell.costLabel }}</span>
        </div>

        <p class="flex-grow-1 mb-3 text-body-secondary">{{ spell.description }}</p>

        <ToggleButton class="align-self-start" :id="toggleId" small :checked="learned" :disabled="!canToggle"
            :tooltip="learnTitle" @toggle="$emit('toggle')">Learn</ToggleButton>
    </AppCard>
</template>
