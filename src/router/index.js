import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ForgeView from '@/views/ForgeView.vue';
import RosterView from '@/views/RosterView.vue';
import GalleryView from '@/views/GalleryView.vue';

// One entry per page. path is what the address bar shows; name is what the
// code uses ({ name: 'forge' }), so a path can change without touching links.
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/forge', name: 'forge', component: ForgeView },
        { path: '/roster', name: 'roster', component: RosterView },
        { path: '/gallery', name: 'gallery', component: GalleryView },
        // Anything else (an old bookmark to view-characters.html, a typo)
        // goes home instead of showing a blank page
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});

export default router;
