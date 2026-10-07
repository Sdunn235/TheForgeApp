// The card frame the whole app uses. AppCard owns the shape: image, title,
// body and footer. Whatever goes inside comes from the page through slots,
// so the same frame can hold a description, a slider, or a menu.
// Every card in the app shares this one look.
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
    //              #menu sits in the top corner; the title makes room for it.
    //              The title is an h3 for the page outline, sized like an h5.
    template: `
        <div class="card h-100 p-3 bg-light border-primary-subtle shadow-sm position-relative">
            <div v-if="$slots.menu" class="card-kebab">
                <slot name="menu"></slot>
            </div>
            <img v-if="image" :src="image" :alt="imageAlt">
            <div class="card-body d-flex flex-column">
                <h3 class="card-title h5" :class="{ 'pe-5': $slots.menu }">{{ title }}</h3>
                <p v-if="description" class="flex-grow-1 mb-3 text-body-secondary">{{ description }}</p>
                <slot></slot>
            </div>
            <div v-if="$slots.footer" class="card-body flex-grow-0">
                <slot name="footer"></slot>
            </div>
        </div>
    `,
};

export default AppCard;
