// The card frame the whole app uses. AppCard owns the shape: image, title,
// body and footer. Whatever goes inside comes from the page through slots,
// so the same frame can hold a description, a slider, or a menu.
const AppCard = {
    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        title: { type: String, required: true },
        image: { type: String, default: '' },
        imageAlt: { type: String, default: '' },
        description: { type: String, default: '' },
    },

    // template:    This component's HTML. A <slot> is a hole the page fills.
    //              The unnamed one gets whatever is between the tags; the
    //              named one gets what the page puts in <template #footer>.
    template: `
        <div class="card h-100">
            <img v-if="image" :src="image" :alt="imageAlt">
            <div class="card-body">
                <h3 class="card-title">{{ title }}</h3>
                <p v-if="description" class="card-text pt-2">{{ description }}</p>
                <slot></slot>
            </div>
            <div v-if="$slots.footer" class="card-body flex-grow-0">
                <slot name="footer"></slot>
            </div>
        </div>
    `,
};

export default AppCard;
