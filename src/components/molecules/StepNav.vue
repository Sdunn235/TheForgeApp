<script>
// The Back / Save bar at the bottom of every forge step. Save is a real
// submit button, so the form's own @submit runs (and the browser checks
// required fields first); Back is a plain button that asks the page.
export default {
    // props:   saveLabel    = "Save Stats", "Finish"...
    //          first        = the first step: nowhere to go back to
    //          saveDisabled = e.g. step 1 until the character has a name
    props: {
        saveLabel: { type: String, required: true },
        first: { type: Boolean, default: false },
        saveDisabled: { type: Boolean, default: false },
    },

    // emits:   back - Back was clicked; the page moves the step
    emits: ['back'],
};
</script>

<template>
    <div class="card-navigation">
        <button type="button" class="btn btn-outline-primary" :disabled="first" @click="$emit('back')">
            &laquo; Back
        </button>
        <button type="submit" class="btn btn-primary" :disabled="saveDisabled">
            {{ saveLabel }} &raquo;
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "@/sass/tools" as *;

// Save / Back button sizing. The small-screen set keeps the labels on one
// line once there is no room for the full-size padding and text.
$card-nav-btn-padding-y: 1rem;
$card-nav-btn-padding-x: 1.5rem;
$card-nav-btn-font-size: 1.5rem;
$card-nav-btn-padding-x-sm: .75rem;
$card-nav-btn-font-size-sm: 1.1rem;

.card-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    background-color: $secondary;

    .btn {
        --bs-btn-padding-y: #{$card-nav-btn-padding-y};
        --bs-btn-padding-x: #{$card-nav-btn-padding-x};
        --bs-btn-font-size: #{$card-nav-btn-font-size};
        --bs-btn-border-radius: .5rem;

        // Keeps "Save Skills »" on one line instead of wrapping
        white-space: nowrap;

        // Below the sm breakpoint the full-size labels no longer fit, so
        // trim the text and side padding rather than let them wrap.
        @include media-breakpoint-down(sm) {
            --bs-btn-padding-x: #{$card-nav-btn-padding-x-sm};
            --bs-btn-font-size: #{$card-nav-btn-font-size-sm};
        }
    }
}
</style>
