import AppModal from './AppModal.js';

// "Are you sure?" built on AppModal. Cancel always just closes. Confirm
// either goes somewhere (href) or tells the parent "confirm" and lets the
// parent decide what that means - the same split as ActionMenu's items.
const ConfirmModal = {
    // components:  Only ConfirmModal uses AppModal directly.
    components: {
        AppModal,
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    //          danger = a red confirm button for things you cannot undo
    //          href   = confirm is a link; without it, confirm is an event
    props: {
        id: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, default: '' },
        confirmLabel: { type: String, required: true },
        cancelLabel: { type: String, default: 'Cancel' },
        danger: { type: Boolean, default: false },
        href: { type: String, default: '' },
    },

    // emits:   confirm - the player said yes (only when there is no href)
    emits: ['confirm'],

    // computed:    Red for danger, the app's main colour otherwise.
    computed: {
        confirmClass: function () {
            return this.danger ? 'btn-danger' : 'btn-primary';
        },
    },

    // methods:     open passes straight through to AppModal, so the page
    //              never needs to know AppModal exists.
    methods: {
        open: function () {
            this.$refs.modal.open();
        },
        confirm: function () {
            this.$refs.modal.close();
            this.$emit('confirm');
        },
    },

    // template:    The default slot shows the message unless the page
    //              fills it with something richer (fallback content).
    template: `
        <app-modal ref="modal" :id="id" :title="title">
            <slot>{{ message }}</slot>
            <template #footer>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ cancelLabel }}</button>
                <a v-if="href" class="btn" :class="confirmClass" :href="href">{{ confirmLabel }}</a>
                <button v-else type="button" class="btn" :class="confirmClass" @click="confirm">{{ confirmLabel }}</button>
            </template>
        </app-modal>
    `,
};

export default ConfirmModal;
