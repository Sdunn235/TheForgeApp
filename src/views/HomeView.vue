<script>
import ActionMenu from '@/components/molecules/ActionMenu.vue';
import AppCard from '@/components/molecules/AppCard.vue';
import PageContentHeader from '@/components/molecules/PageContentHeader.vue';
import { forges } from '@/data/forges.js';

// The home page: the video banner, the heading, and one card per design area.
// The cards' words and links live in data/forges.js; only this page shows them.
export default {
    components: {
        ActionMenu,
        AppCard,
        PageContentHeader,
    },

    // data:    The heading text belongs to this page alone. forges is the
    //          imported list itself, not a copy: nothing here ever changes it.
    data: function () {
        return {
            appName: 'Welcome to The Forge',
            tagline: 'This is the description for The Forge. Explain Use and design in a high top-down approach.',
            forges: forges,
        };
    },
};
</script>

<template>
    <div class="video-hero">
        <iframe
            src="https://www.youtube.com/embed/ez68sFkO6Qo?autoplay=1&mute=1&loop=1&playlist=ez68sFkO6Qo&controls=0&playsinline=1"
            title="Background video" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
    </div>

    <div class="container text-start mt-5 pt-5">
        <PageContentHeader :title="appName" :description="tagline" />

        <!-- One card per forge. The frame lives in AppCard; the words for each
            one live in data/forges.js. -->
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col" v-for="forge in forges" :key="forge.title">
                <AppCard :title="forge.title" :description="forge.description" :image="forge.image"
                    :image-alt="forge.alt">
                    <template #footer>
                        <ActionMenu class="d-grid" variant="button" :items="forge.links" :label="forge.buttonLabel" />
                    </template>
                </AppCard>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
// Video banner behind the page heading
.video-hero {
    position: relative;
    height: 800px;
    overflow: hidden;
    background-color: #000;

    // Fill the banner and centre the video
    iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    // Dark overlay so the text stays readable
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
    }
}
</style>
