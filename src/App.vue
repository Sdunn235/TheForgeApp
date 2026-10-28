<script>
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import { seedRoster } from '@/helpers/seed.js';

// The whole app's frame: the navbar, and the hole the router fills with the
// current page. Every page shares this, so it's the place for anything that
// should happen once when the app starts.
export default {
    components: {
        AppNavbar,
    },

    // created:     Runs once, as the app starts. The sample characters are
    //              added the first time only (seedRoster checks its own flag).
    //              It used to run on every page load, in each page's mounted.
    created: function () {
        seedRoster();
    },
};
</script>

<template>
    <AppNavbar />
    <!-- The router puts the current page here: HomeView, ForgeView... -->
    <RouterView />
</template>
