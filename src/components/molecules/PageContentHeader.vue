<script>
// The heading block at the top of a page: a big title over a line of
// description. The home page uses it, and future landing pages can too.
// The title and description come from the page through props, so the same
// component can be used on different pages with different words.
export default {
    // props:   Data passed in from the parent through attributes.
    //          Read them, never assign to them. They belong to the parent.
    props: {
        title: { type: String, required: true },
        description: { type: String, default: '' },
    },
};
</script>

<template>
    <div class="row bg-secondary mb-4 px-2 row-cols-1 g-0 page-heading">
        <div class="container col">
            <h1 class="display-1 pb-2 border-bottom border-primary">{{ title }}</h1>
            <p v-if="description" class="lead">{{ description }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
// The lavender banner a page opens with
$page-heading-radius: .4rem;

.page-heading {
    border-radius: $page-heading-radius;
}

// Spacing only; the size comes from $lead-font-size (in _tools.scss)
.lead {
    margin-bottom: 0;
    padding-bottom: 1rem;
}
</style>
