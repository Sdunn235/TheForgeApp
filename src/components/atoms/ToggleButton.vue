<script>
import vTooltip from '@/directives/tooltip.js';

// A checkbox drawn as a button: each ability's toggle and each spell's Learn
// button. Grey when it can't be taken, purple when it can, green when it's on.
// The parent owns the state and decides what a click means; this button
// only shows the state it is given and reports the click.
export default {
    // directives:  custom v- attributes this template uses
    directives: {
        tooltip: vTooltip,
    },

    // props:   id       = links the label to its checkbox, so clicking the
    //                     label clicks the box
    //          checked  = on or off, as the parent sees it
    //          disabled = can't be clicked (still shows its tooltip)
    //          tooltip  = why it's blocked, or what it does
    //          small    = the smaller look, for a spell card's Learn button
    props: {
        id: { type: String, required: true },
        checked: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        tooltip: { type: String, default: '' },
        small: { type: Boolean, default: false },
    },

    // emits:   toggle - the player clicked it. A verb event, not v-model:
    //          the parent's "is it on?" is worked out from a list
    //          (learnedAbilities.includes(...)), so there is nothing for
    //          v-model to write to. The parent runs its own toggle method.
    emits: ['toggle'],
};
</script>

<template>
    <!-- One <span> around both, so a class the page puts on <ToggleButton>
        has one element to land on. The label's text comes from the slot. -->
    <span>
        <input type="checkbox" class="btn-check" :id="id" autocomplete="off" :checked="checked" :disabled="disabled"
            @change="$emit('toggle')">
        <label class="btn toggle-button" :class="{ 'btn-sm': small }" :for="id" v-tooltip="tooltip">
            <slot></slot>
        </label>
    </span>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "@/sass/tools" as *;

// Grey by default, green when on. Sizing lives here, so the buttons scale on
// their own, apart from the app's other buttons.
.toggle-button {
    --bs-btn-padding-y: 1rem;
    --bs-btn-padding-x: 1.5rem;
    --bs-btn-font-size: 1.5rem;
    --bs-btn-border-radius: .5rem;

    --bs-btn-color: #fff;
    --bs-btn-bg: #{$disabled};
    --bs-btn-border-color: #{$disabled};
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #{color.adjust($disabled, $lightness: -8%)};
    --bs-btn-hover-border-color: #{color.adjust($disabled, $lightness: -8%)};
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #{$success};
    --bs-btn-active-border-color: #{$success};
}

// Three states, three colours. Blocked and available used to be the same
// grey, told apart only by Bootstrap's dimming of a disabled button, which
// reads as faint rather than as a different state. So: grey means you can't
// take it, purple means you can, green means you have it.
.btn-check:not(:checked):not(:disabled)+.toggle-button {
    --bs-btn-bg: #{$primary};
    --bs-btn-border-color: #{$primary};
    --bs-btn-hover-bg: #{color.adjust($primary, $lightness: -8%)};
    --bs-btn-hover-border-color: #{color.adjust($primary, $lightness: -8%)};
}

// Bootstrap turns off pointer events on a disabled button, which also kills
// its tooltip - and a blocked one is exactly the one that needs to explain
// itself. The checkbox is still disabled, so a click does nothing; this only
// lets the tooltip show. The cursor still says it's unavailable.
.btn-check:disabled+.toggle-button {
    pointer-events: auto;
    cursor: not-allowed;
}
</style>
