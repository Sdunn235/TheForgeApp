// v-tooltip: a Bootstrap tooltip that lives and dies with its element.
//   <li v-tooltip="effect.description">
// Vue calls these hooks with the element itself (el), so nothing searches
// the page. The old startTooltips found every tooltip with querySelectorAll
// and never cleaned up, so a removed row left its tooltip on screen.
const vTooltip = {
    // mounted:     The element just appeared. Give it its tooltip.
    //              binding.value is whatever is in the quotes. No text, no tooltip.
    mounted: function (el, binding) {
        if (binding.value) {
            new bootstrap.Tooltip(el, { title: binding.value });
        }
    },

    // updated:     The page redrew. If the text changed (an ability was
    //              learned, say), put the new text in. Bootstrap keeps the
    //              text it started with otherwise.
    updated: function (el, binding) {
        const tooltip = bootstrap.Tooltip.getInstance(el);

        if (tooltip && binding.value !== binding.oldValue) {
            tooltip.setContent({ '.tooltip-inner': binding.value });
        }
    },

    // beforeUnmount:   The element is about to be removed. dispose() takes
    //                  the tooltip box off the page with it.
    beforeUnmount: function (el) {
        const tooltip = bootstrap.Tooltip.getInstance(el);

        if (tooltip) {
            tooltip.dispose();
        }
    },
};

export default vTooltip;
