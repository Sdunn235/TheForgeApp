<script>
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import { buildSampleRoster } from '@/helpers/seed.js';

// The whole app's frame: the navbar, and the hole the router fills with the
// current page. It is the one component that outlives every page, so it
// owns the roster: the forge saves into it and the roster page reads it.
export default {
    components: {
        AppNavbar,
    },

    // data:    The roster, built from the samples as the app starts. Storage
    //          is off for this assignment, so a reload starts it fresh.
    data: function () {
        return {
            roster: buildSampleRoster(),
        };
    },

    // provide:     Hands things to every component below this one, however
    //              deep, without passing a prop through each level. A page
    //              takes what it needs with inject. The router draws the
    //              pages, so there is no tag here to put props on.
    //              The roster is handed down to READ. Changes go through
    //              App's own methods, so the owner still makes every change
    //              (the same idea as props down, events up).
    provide: function () {
        return {
            roster: this.roster,
            saveToRoster: this.saveToRoster,
            deleteFromRoster: this.deleteFromRoster,
        };
    },

    methods: {
        // Hands back the id the character was saved under
        saveToRoster: function (character) {
            return this.roster.save(character);
        },

        deleteFromRoster: function (character) {
            this.roster.remove(character);
        },
    },
};
</script>

<template>
    <AppNavbar />
    <!-- The router puts the current page here: HomeView, ForgeView... -->
    <RouterView />
</template>
