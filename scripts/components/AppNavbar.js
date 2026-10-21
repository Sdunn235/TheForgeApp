// The navbar for every page: the top bar on large screens and the bottom bar
// on phones, drawn from one list of links. The page says which link is
// active and whether leaving needs a "are you sure?" first.
const AppNavbar = {
    // data:    The app's pages. Only the navbar uses this list, so it lives
    //          here. label is for the top bar, shortLabel for the phone bar.
    data: function () {
        return {
            links: [
                { id: 'home', label: 'Home', shortLabel: 'Home', href: './index.html', icon: 'bi bi-house-door' },
                { id: 'forge', label: 'Forge Character', shortLabel: 'Create', href: './creation-character.html', icon: 'bi bi-hammer' },
                { id: 'roster', label: 'Roster', shortLabel: 'Roster', href: './view-characters.html', icon: 'bi bi-people' },
            ],
        };
    },

    // props:   active = which page this is, so its link is highlighted
    //          guard  = ask before leaving (the forge, which has unsaved work)
    props: {
        active: {
            type: String,
            required: true,
            validator: function (value) {
                return ['home', 'forge', 'roster'].includes(value);
            },
        },
        guard: { type: Boolean, default: false },
    },

    // emits:   leave - with guard on, a link was clicked. Sends where to go;
    //          the page decides whether to ask first.
    emits: ['leave'],

    // computed:    The brand and the close button both go home.
    computed: {
        homeLink: function () {
            return this.links[0];
        },
    },

    // methods:     A click on the page you are already on does nothing
    //              (reloading the forge would lose your work). With guard on,
    //              stop the browser leaving and tell the page instead.
    methods: {
        onClick: function (event, link) {
            if (link.id === this.active) {
                event.preventDefault();
                return;
            }

            if (this.guard) {
                event.preventDefault();
                this.$emit('leave', link.href);
            }
        },
    },

    // template:    Two bars from one list. d-none / d-lg-flex swap them at
    //              the lg breakpoint, exactly as the hand-written ones did.
    template: `
        <nav class="navbar fixed-top navbar-expand-lg bg-primary d-none d-lg-flex" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" :href="homeLink.href" @click="onClick($event, homeLink)">The Forge</a>

                <ul class="navbar-nav flex-row ms-auto me-3">
                    <li class="nav-item" v-for="link in links" :key="link.id">
                        <a class="nav-link px-3" :class="{ active: link.id === active }" :href="link.href"
                            :aria-current="link.id === active ? 'page' : null"
                            @click="onClick($event, link)">{{ link.label }}</a>
                    </li>
                </ul>
            </div>
        </nav>

        <nav class="navbar fixed-bottom bg-primary d-lg-none mobile-bottom-nav" data-bs-theme="dark">
            <div class="container-fluid">
                <ul class="navbar-nav flex-row w-100 justify-content-around">
                    <li class="nav-item" v-for="link in links" :key="link.id">
                        <a class="nav-link text-center" :class="{ active: link.id === active }" :href="link.href"
                            :aria-current="link.id === active ? 'page' : null"
                            @click="onClick($event, link)">
                            <i class="d-block" :class="link.icon"></i>
                            {{ link.shortLabel }}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    `,
};

export default AppNavbar;
