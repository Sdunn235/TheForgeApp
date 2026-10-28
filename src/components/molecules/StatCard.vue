<script>
import AppCard from '@/components/molecules/AppCard.vue';
import RangeSlider from '@/components/molecules/RangeSlider.vue';

// One attribute on the Stats step: its card, its slider, and the rule that
// you cannot spend points you do not have. The page owns the value and the
// pool; StatCard works out the limit and reports changes up.
export default {
    // components:  The pieces this card is built from. Registered here,
    //              because only StatCard uses them directly.
    components: {
        AppCard,
        RangeSlider,
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    //          stat        = id, label, description, min, max
    //          modelValue  = the stat's current value (filled by v-model)
    //          pointsLeft  = what is left in the shared pool
    props: {
        stat: { type: Object, required: true },
        modelValue: { type: Number, required: true },
        pointsLeft: { type: Number, required: true },
    },

    // emits:   The one event this card sends: "the value changed".
    emits: ['update:modelValue'],

    // computed:    The highest this stat can reach right now: its own
    //              ceiling, or whatever the pool can pay for, whichever
    //              comes first.
    computed: {
        affordableMax: function () {
            return Math.min(this.stat.max, this.modelValue + this.pointsLeft);
        },
    },
};
</script>

<template>
    <!-- AppCard is the frame, RangeSlider sits in its slot. The slider's
        change is passed straight up (a relay), because StatCard may not
        assign to its own prop. -->
    <AppCard :title="stat.label" :description="stat.description">
        <RangeSlider :id="stat.id" :label="stat.label" variant="card" :min="stat.min" :max="stat.max"
            :cap="affordableMax" :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)" />
    </AppCard>
</template>
