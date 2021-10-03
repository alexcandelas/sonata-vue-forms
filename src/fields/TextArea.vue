<template>
    <textarea
        :id="computedId"
        :name="computedName"
        class="form-field"
        :class="{
            'form-field--invalid': hasErrors,
            'form-field--no-scrollbar': ! hasScrollbar
        }"
        :maxlength="maxlength"
        rows="6"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        :value="value"
        @input="$emit('input', $event.target.value)"
    ><slot></slot></textarea>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        componentName: 'TextArea',

        props: {
            /**
             * Define the maximum number of characters allowed.
             */
            maxlength: {
                type: String,
                required: false,
                default: '10000'
            }
        },

        data() {
            return {
                hasScrollbar: false
            };
        },

        watch: {
            value: function() {
                this.hasScrollbar = this.$el.scrollHeight >= this.$el.offsetHeight;
            }
        }
    };
</script>
