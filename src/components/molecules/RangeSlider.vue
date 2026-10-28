<script>
import vTooltip from '@/directives/tooltip.js';

// A slider with its label and value badge, as one piece. Used for Level,
// HP/MP/SP, the six stats and every skill.
// The value belongs to the parent. This component never changes it: it
// reports each drag up with an emit, and the parent's v-model does the rest.
export default {
    // directives:  custom v- attributes this template uses
    directives: {
        tooltip: vTooltip,
    },

    // data:    The looks this slider can take. Only this component uses them.
    //          Everything that differs between looks lives here; what every
    //          look shares stays in the template.
    data: function () {
        return {
            variants: {
                // The Level row: one size up, a blue badge, a yellow track
                level: {
                    rowClass: 'align-items-center gap-2 level-row',
                    labelClass: 'mb-0 vitals-label',
                    badgeClass: 'vitals-value bg-primary',
                    fillClass: 'range-level',
                },
                // HP / MP / SP: normal size, a grey badge. Each bar's colour
                // comes in through the fillClass prop instead.
                vital: {
                    rowClass: 'align-items-center gap-2 vitals-row',
                    labelClass: 'mb-0 vitals-label',
                    badgeClass: 'vitals-value bg-secondary text-dark',
                    fillClass: '',
                },
                // Inside a card (stats, skills): the card's title already
                // names it, so the label is for screen readers only, and the
                // value sits big and centred under the slider.
                card: {
                    rowClass: 'flex-column',
                    labelClass: 'fw-semibold visually-hidden',
                    badgeClass: 'bg-secondary text-dark align-self-center fs-3 mt-2',
                    fillClass: 'range-stat',
                },
            },
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        id: { type: String, required: true },
        label: { type: String, required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        // The value itself. v-model on the tag fills this in.
        modelValue: { type: Number, required: true },
        // The highest value allowed right now, if lower than max. null means
        // no cap: the whole track is allowed.
        cap: { type: Number, default: null },
        // Shown on hover over the label. Empty means no tooltip.
        tooltip: { type: String, default: '' },
        // Overrides the variant's track colour, e.g. range-health for HP
        fillClass: { type: String, default: '' },
        // The badge reads "12 / 50" instead of "12"
        showMax: { type: Boolean, default: false },
        variant: {
            type: String,
            required: true,
            validator: function (value) {
                return ['level', 'vital', 'card'].includes(value);
            },
        },
    },

    // emits:   The events this component sends up to its parent.
    emits: ['update:modelValue'],

    // computed:    Worked out from the props, and updated when they change.
    computed: {
        look: function () {
            return this.variants[this.variant];
        },

        // How far along the track the thumb sits, as a percentage. The style
        // block below paints the filled part of the track from --range-fill.
        fillPercent: function () {
            const span = this.max - this.min;
            const filled = span === 0 ? 0 : (this.modelValue - this.min) / span * 100;

            return Math.round(filled) + '%';
        },
    },

    // methods: Usually "events" triggered by v-on:
    methods: {
        // Runs on every drag. A slider hands back text ("12"), so Number()
        // turns it into a number. Anything past the cap is refused: the
        // parent is only ever asked for what is allowed.
        onInput: function (event) {
            let wanted = Number(event.target.value);

            if (this.cap !== null && wanted > this.cap) {
                wanted = this.cap;

                // If the parent's value is already at the cap, asking for it
                // again changes nothing, so Vue has nothing to redraw and the
                // thumb would stay where the mouse left it. Put it back.
                event.target.value = wanted;
            }

            this.$emit('update:modelValue', wanted);
        },
    },
};
</script>

<template>
    <div class="d-flex" :class="look.rowClass">
        <label :for="id" class="form-label" :class="look.labelClass" v-tooltip="tooltip">{{ label }}</label>
        <input type="range" class="form-range flex-grow-1" :class="fillClass || look.fillClass" :id="id" :name="id"
            :min="min" :max="max" :value="modelValue" @input="onInput" :style="{ '--range-fill': fillPercent }">
        <output :for="id" class="badge" :class="look.badgeClass" aria-hidden="true">
            {{ modelValue }}<template v-if="showMax"> / {{ max }}</template>
        </output>
    </div>
</template>

<style scoped lang="scss">
@use "sass:map";
@use "@/sass/tools" as *;

// Keeps the HP/MP/SP bars lined up with each other.
$vitals-label-min-width: 1.75rem;

.vitals-label {
    min-width: $vitals-label-min-width;
}

// The Level row is the same three-part row as HP/MP/SP, one size up, because
// it drives all three of them. Its label needs more room than "HP".
$level-row-font-size: 1.25rem;
$level-row-margin-bottom: 1.5rem;
$level-label-min-width: 3.5rem;

.level-row {
    font-size: $level-row-font-size;
    margin-bottom: $level-row-margin-bottom;

    // .badge sizes itself in em, so it scales with the row on its own
    .vitals-label {
        min-width: $level-label-min-width;
    }
}

// Left padding for the value badges only. Bootstrap builds badge padding from
// a two-value shorthand, so the start edge needs its own declaration. In em,
// so the Level badge (a larger row) gets the same gap.
$vitals-value-padding-start: .5em;

.badge.vitals-value {
    padding-inline-start: $vitals-value-padding-start;
}

// Sliders fill as they move. Bootstrap's Range docs say a filled track is
// "not currently supported" (only Firefox does it natively), so it is built
// by hand: the track paints a two-stop gradient that switches colour at
// --range-fill, which fillPercent keeps in step with the value.
//
// A track can only be reached through a browser-specific selector, and the
// two cannot share a selector list (a browser drops a whole rule if it does
// not know one selector in it), so the mixin writes the gradient twice.
@mixin range-fill($color) {
    $fill: linear-gradient(to right,
            $color 0 var(--range-fill, 0%),
            $form-range-track-bg var(--range-fill, 0%) 100%);

    &::-webkit-slider-runnable-track {
        background-image: $fill;
    }

    &::-moz-range-track {
        background-image: $fill;
    }
}

// Vitals keep the colours their bars carried
.range-health {
    @include range-fill(map.get($forge-colors, "health"));
}

.range-mana {
    @include range-fill(map.get($forge-colors, "mana"));
}

.range-stamina {
    @include range-fill(map.get($forge-colors, "stamina"));
}

// Stats and skills share one green; Level takes gold
.range-stat {
    @include range-fill($success);
}

.range-level {
    @include range-fill($warning);
}

// Space below the track, for the card look where the badge sits underneath.
// Height is left to Bootstrap so the focus ring is not clipped.
$form-range-spacing: 1rem;

.form-range {
    padding-bottom: $form-range-spacing;
}

// In a row the padding would make the input taller than what it draws, so
// centring the row would centre the padding and the label would sit low.
.vitals-row,
.level-row {
    .form-range {
        padding-bottom: 0;
    }
}
</style>
