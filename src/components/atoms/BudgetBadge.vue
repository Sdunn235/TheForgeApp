<script>
// The "how much is left" badge: stat points, feat slots, spells known.
// It owns one rule, so the three badges can never disagree: over budget is
// red, exactly spent is amber, anything left is blue. That rule used to be
// written out three times in app.js (statPointsBadge, featsBadgeClass,
// spellsBadgeClass): Duplicate Code, fixed by Extract Class.
export default {
    // props:   left = what is still unspent. Below 0 means over budget.
    props: {
        left: { type: Number, required: true },
    },

    // computed:    Three outcomes need an if, and a template only has room
    //              for one ternary, so the choice is made here.
    computed: {
        budgetClass: function () {
            if (this.left < 0) {
                return 'bg-danger';
            }

            if (this.left === 0) {
                return 'bg-warning text-dark';
            }

            return 'bg-primary';
        },
    },
};
</script>

<template>
    <!-- The slot is the badge's text. Leave it empty and the badge shows the
        number left (fallback content, the same idea as ConfirmModal's message). -->
    <output class="badge" :class="budgetClass">
        <slot>{{ left }}</slot>
    </output>
</template>
