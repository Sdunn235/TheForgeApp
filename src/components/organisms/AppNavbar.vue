<script>
// The navbar for every page: the top bar on large screens and the bottom bar
// on phones, drawn from one list of links. The router knows which page is
// showing, so the navbar no longer needs to be told (the old active and
// guard props and the leave event are gone: Remove Parameter).
export default {
    // data:    The app's pages. Only the navbar uses this list, so it lives
    //          here. label is for the top bar, shortLabel for the phone bar.
    data: function () {
        return {
            links: [
                { id: 'home', label: 'Home', shortLabel: 'Home', to: { name: 'home' }, icon: 'bi bi-house-door' },
                { id: 'forge', label: 'Forge Character', shortLabel: 'Create', to: { name: 'forge' }, icon: 'bi bi-hammer' },
                { id: 'roster', label: 'Roster', shortLabel: 'Roster', to: { name: 'roster' }, icon: 'bi bi-people' },
            ],
        };
    },
};
</script>

<template>
    <!-- RouterLink adds "active" (Bootstrap's highlight) and aria-current="page"
        to the link for the page that is showing, by itself. Clicking the page
        you're already on does nothing, so a click can't reload the forge and
        lose your work. Two root elements are fine in Vue 3. -->
    <nav class="navbar fixed-top navbar-expand-lg bg-primary d-none d-lg-flex" data-bs-theme="dark">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" :to="{ name: 'home' }">The Forge</RouterLink>

            <ul class="navbar-nav flex-row ms-auto me-3">
                <li class="nav-item" v-for="link in links" :key="link.id">
                    <RouterLink class="nav-link px-3" active-class="active" :to="link.to">{{ link.label }}</RouterLink>
                </li>
            </ul>
        </div>
    </nav>

    <nav class="navbar fixed-bottom bg-primary d-lg-none mobile-bottom-nav" data-bs-theme="dark">
        <div class="container-fluid">
            <ul class="navbar-nav flex-row w-100 justify-content-around">
                <li class="nav-item" v-for="link in links" :key="link.id">
                    <RouterLink class="nav-link text-center" active-class="active" :to="link.to">
                        <i class="d-block" :class="link.icon"></i>
                        {{ link.shortLabel }}
                    </RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>
<style scoped lang="scss">
@use "@/sass/tools" as *;

// The top bar. min-height, not height: an expanded mobile menu grows past
// 100px, and a fixed height would clip the background out from under it.
$navbar-fixed-height: 100px;

.fixed-top {
    min-height: $navbar-fixed-height;
}

// The phone bar, shown below the lg breakpoint only. Its height lives in
// _tools.scss, because app.scss pads the bottom of the page by the same amount.
$mobile-nav-icon-size: 1.4rem;
$mobile-nav-font-size: .8rem;

.mobile-bottom-nav {
    // Fixed rather than min-height, so the page padding can match it
    height: $mobile-nav-height;
    padding-block: 0;

    .nav-link {
        // Bootstrap pads .nav-link on its own, which pushed the bar taller
        // than $mobile-nav-height and hid the bottom of the page
        padding-block: .15rem;
        font-size: $mobile-nav-font-size;
        line-height: 1.2;
    }

    .bi {
        font-size: $mobile-nav-icon-size;
    }
}
</style>
