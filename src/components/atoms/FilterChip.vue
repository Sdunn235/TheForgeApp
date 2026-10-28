<script>
// A grey pill showing one active filter, with a ✕ to clear it: the
// roster's "Name contains ..." and "Type: NPCs". The page decides what
// clearing means (it puts its own value back to the start).
export default {
    // props:   clearLabel = what a screen reader says for the ✕
    props: {
        clearLabel: { type: String, required: true },
    },

    // emits:   clear - the ✕ was clicked
    emits: ['clear'],
};
</script>

<template>
    <!-- role="status": screen readers announce the change politely. The old
        pills used role="alert", which interrupts, and a filter isn't urgent. -->
    <div class="alert alert-secondary py-1 px-3 mb-0" role="status">
        <slot></slot>
        <button type="button" class="btn-close position-static ms-2 p-2" :aria-label="clearLabel"
            @click="$emit('clear')"></button>
    </div>
</template>
