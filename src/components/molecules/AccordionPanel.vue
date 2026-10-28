<script>
// One collapsing section: a header button, an optional menu beside it, and a
// body that opens and closes. Skills, Abilities and Spells each have one per
// category or school, and Feats has one. The page puts its panels inside a
// <div class="accordion">, which groups them.
//
// Bootstrap does the opening and closing (data-bs-toggle="collapse"). It
// finds the body by id, so the page gives each panel a unique base id and
// this component builds the two strings Bootstrap needs from it. That
// replaced three pairs of panelId / panelTarget methods in app.js.
export default {
    // props:   id    = a base unique on the page, e.g. 'skill-' + category.id
    //          title = the header text
    props: {
        id: { type: String, required: true },
        title: { type: String, required: true },
    },

    // computed:    The body's id, and the same with # in front for the
    //              button's data-bs-target. '-panel' on the end keeps it from
    //              clashing with other ids built from the same name.
    computed: {
        panelId: function () {
            return this.id + '-panel';
        },
        panelTarget: function () {
            return '#' + this.panelId;
        },
    },
};
</script>

<template>
    <!-- A button can't sit inside another button, so the menu sits beside the
        header button, and the row takes on the button's colours instead. -->
    <div class="accordion-item">
        <div class="d-flex align-items-center accordion-header-row">
            <h2 class="accordion-header flex-grow-1">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    :data-bs-target="panelTarget" aria-expanded="false" :aria-controls="panelId">
                    {{ title }}
                </button>
            </h2>
            <slot name="menu"></slot>
        </div>

        <div :id="panelId" class="accordion-collapse collapse">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/sass/tools" as *;

// Header text. Bootstrap has no $accordion-button-font-size, so this is the knob.
.accordion-button {
    font-size: $h5-font-size;
}

// Moves the chevron ahead of the header text. .accordion-button is a flex
// container, so order: -1 moves its ::after chevron to the front.
.accordion-button::after {
    order: -1;
    margin-left: 0;
    margin-right: $accordion-chevron-gap;
}

// The row takes on the button's colours. :has() follows the open state:
// Bootstrap drops .collapsed from the button when its panel opens.
.accordion-header-row {
    background-color: var(--bs-accordion-btn-bg);

    &:has(.accordion-button:not(.collapsed)) {
        background-color: var(--bs-accordion-active-bg);
        box-shadow: inset 0 calc(-1 * var(--bs-accordion-border-width)) 0 var(--bs-accordion-border-color);
    }

    // Bootstrap rings the button on focus, which leaves the ⋮ outside the
    // ring. Ring the whole row instead, and only for keyboard focus
    // (:focus-visible): a mouse click doesn't need one.
    .accordion-button:focus {
        box-shadow: none;
    }

    &:has(.accordion-button:focus-visible) {
        position: relative;
        z-index: 3;
        box-shadow: var(--bs-accordion-btn-focus-box-shadow);
    }
}

// The first panel's top corners match the accordion's rounded border.
.accordion-item:first-of-type>.accordion-header-row {
    border-top-left-radius: var(--bs-accordion-inner-border-radius);
    border-top-right-radius: var(--bs-accordion-inner-border-radius);
}
</style>
