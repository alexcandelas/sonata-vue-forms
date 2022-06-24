<template>
    <textarea
        :id="computedId"
        :name="name"
        class="form-field"
        :class="{
            'form-field--invalid': hasErrors,
            'form-field--no-scrollbar': ! hasScrollbar
        }"
        rows="6"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        componentName: 'TextArea',

        data() {
            return {
                hasScrollbar: false
            };
        },

        watch: {
            modelValue: function() {
                this.hasScrollbar = this.$el.scrollHeight >= this.$el.offsetHeight;
            }
        }
    };
</script>
