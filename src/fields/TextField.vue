<template>
    <input
        :id="computedId"
        :name="name"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        type="text"
        :inputmode="internalInputMode"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        :value="modelValue"
        @input="formatValue"
    >
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        componentName: 'TextField',

        props: {
            /**
             * Limit the characters allowed with a regular expression.
             */
            regex: {
                type: String,
                required: false,
                default: ''
            }
        },

        computed: {
            /**
             * Set an `inputmode` property to input element if needed.
             */
            internalInputMode: function() {
                if (this.$attrs.inputmode) {
                    return this.$attrs.inputmode;
                }

                if (this.regex === 'numeric' || this.regex === 'decimal') {
                    return 'decimal';
                }

                return null;
            },

            /**
             * Set the regular expression to limit the allowed characters.
             */
            internalRegex: function() {
                if (this.regex === 'numeric') {
                    return '\\d+';
                }

                if (this.regex === 'decimal') {
                    return '[\\d.]+';
                }

                return this.regex;
            }
        },

        methods: {
            /**
             * Remove characters if a regular expression is provided,
             * and emit the value.
             *
             * @param {Object} e
             */
            formatValue(e) {
                if (! this.internalRegex) {
                    return this.$emit('update:modelValue', e.target.value);
                }

                const regex = new RegExp(this.internalRegex, 'g');
                const matches = e.target.value.match(regex);
                const newValue = matches ? matches.join('') : '';

                this.$emit('update:modelValue', newValue);

                if (newValue === this.modelValue) {
                    this.$forceUpdate();
                }
            }
        }
    };
</script>
