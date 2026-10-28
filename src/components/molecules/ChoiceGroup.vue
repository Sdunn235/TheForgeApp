<script>
// A row of buttons where exactly one is picked: the roster's Character Type
// filter and its Sort By. The parent's v-model holds which one; this
// component shows it and reports a new pick.
export default {
    // props:   modelValue = the picked option's id (filled by v-model)
    //          options    = [{ id, label }], the buttons in order
    //          name       = groups the radios, and makes each id unique
    //          label      = what a screen reader calls the group
    props: {
        modelValue: { type: String, required: true },
        options: { type: Array, required: true },
        name: { type: String, required: true },
        label: { type: String, required: true },
    },

    // emits:   update:modelValue - a different button was picked
    emits: ['update:modelValue'],

    // methods:     Each radio's id, built from the group's name, so two
    //              groups on one page can't clash
    methods: {
        optionId: function (option) {
            return this.name + '-' + option.id;
        },
    },
};
</script>

<template>
    <!-- :checked + @change instead of v-model: v-model here would assign to
        this component's own prop (rule 1). The parent's v-model does the
        assigning. -->
    <div class="btn-group w-100" role="group" :aria-label="label">
        <template v-for="option in options" :key="option.id">
            <input type="radio" class="btn-check" :name="name" :id="optionId(option)" :value="option.id"
                :checked="option.id === modelValue" @change="$emit('update:modelValue', option.id)">
            <label class="btn btn-outline-primary" :for="optionId(option)">{{ option.label }}</label>
        </template>
    </div>
</template>
