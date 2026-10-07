// The Bootstrap modal shell the whole app uses: header, body, footer.
// It owns the Bootstrap Modal object - made from its own element when it
// appears, thrown away when it is removed - so nothing else has to search
// the page for it. Based on the teacher's AppModal.
const AppModal = {
    // data:    This component's own values.
    //          bsModal = the Bootstrap object that shows and hides the modal
    //          closing = true while it closes; the template turns it into
    //                    inert, which makes the browser drop focus from
    //                    inside before Bootstrap hides it from screen readers
    data: function () {
        return {
            bsModal: null,
            closing: false,
        };
    },

    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    //          id    = given by the page, so Bootstrap links can target it
    //          title = the heading at the top
    props: {
        id: { type: String, required: true },
        title: { type: String, required: true },
    },

    // computed:    The heading's ID, built from the modal's own, so the
    //              modal can say which heading names it (aria-labelledby).
    computed: {
        titleId: function () {
            return this.id + 'Label';
        },
    },

    // methods:     open/close are for the parent to call through a ref.
    //              onShow/onHide follow Bootstrap's own events, so they run
    //              however the modal opens or closes (button, X, Esc, backdrop).
    methods: {
        open: function () {
            this.bsModal.show();
        },
        close: function () {
            this.bsModal.hide();
        },
        onShow: function () {
            this.closing = false;
        },
        onHide: function () {
            this.closing = true;
        },
    },

    // mounted:     The element exists now, so hand it to Bootstrap and
    //              listen for its open/close events. Vue's @ cannot hear
    //              these: it reads the dots in "hide.bs.modal" as modifiers.
    mounted: function () {
        this.bsModal = new bootstrap.Modal(this.$refs.modal);
        this.$refs.modal.addEventListener('show.bs.modal', this.onShow);
        this.$refs.modal.addEventListener('hide.bs.modal', this.onHide);
    },

    // beforeUnmount:   About to be removed. Clean up what mounted made.
    beforeUnmount: function () {
        this.$refs.modal.removeEventListener('show.bs.modal', this.onShow);
        this.$refs.modal.removeEventListener('hide.bs.modal', this.onHide);
        this.bsModal.dispose();
    },

    // template:    ref="modal" is how this component finds its own element.
    //              :inert comes from data; Vue adds and removes it.
    template: `
        <div ref="modal" class="modal fade" :id="id" tabindex="-1" :aria-labelledby="titleId" aria-hidden="true"
            :inert="closing">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="titleId">{{ title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div v-if="$slots.footer" class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    `,
};

export default AppModal;

