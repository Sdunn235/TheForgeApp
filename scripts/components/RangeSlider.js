// A slider with its label and value badge, as one piece. The Level bar is
// first; HP/MP/SP, the six stats and every skill join it later.
// The value belongs to the parent. This component never changes it: it
// reports each drag up with an emit, and the parent's v-model does the rest.
const RangeSlider = {
    // data:    The looks this slider can take. Only this component uses them.
    data: function () {
        return {
            variants: {
                // The Level row: one size up, a blue badge, a yellow track
                level: {
                    rowClass: 'level-row',
                    badgeClass: 'bg-primary',
                    fillClass: 'range-level',
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
        // Shown on hover over the label. Empty means no tooltip.
        tooltip: { type: String, default: '' },
        // The badge reads "12 / 50" instead of "12"
        showMax: { type: Boolean, default: false },
        variant: {
            type: String,
            required: true,
            validator: function (value) {
                return ['level'].includes(value);
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

        // How far along the track the thumb sits, as a percentage.
        // forge.scss paints the filled part of the track from --range-fill.
        // Was fillPercent(stat) in app.js.
        fillPercent: function () {
            const span = this.max - this.min;
            const filled = span === 0 ? 0 : (this.modelValue - this.min) / span * 100;

            return Math.round(filled) + '%';
        },
    },

    // methods: Usually "events" triggered by v-on:
    methods: {
        // Runs on every drag. A slider hands back text ("12"), so Number()
        // turns it into a number before it goes up to the parent.
        onInput: function (event) {
            this.$emit('update:modelValue', Number(event.target.value));
        },
    },

    // template:    This component's HTML.
    template: `
        <div class="d-flex align-items-center gap-2" :class="look.rowClass">
            <label :for="id" class="form-label mb-0 vitals-label"
                :data-bs-toggle="tooltip ? 'tooltip' : null" data-bs-placement="top"
                :title="tooltip || null">{{ label }}</label>
            <input type="range" class="form-range flex-grow-1" :class="look.fillClass"
                :id="id" :name="id" :min="min" :max="max" :value="modelValue"
                @input="onInput" :style="{ '--range-fill': fillPercent }">
            <output :for="id" class="badge vitals-value" :class="look.badgeClass" aria-hidden="true">
                {{ modelValue }}<template v-if="showMax"> / {{ max }}</template>
            </output>
        </div>
    `,
};

export default RangeSlider;
