<template>
    <input
        :id="computedId"
        :name="computedName"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        type="text"
        :maxlength="maxlength"
        :inputmode="internalInputMode"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        :value="internalValue"
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
             * Define the maximum number of characters allowed.
             */
            maxlength: {
                type: String,
                required: false,
                default: '255'
            },

            /**
             * Limit the characters allowed with a regular expression.
             */
            regex: {
                type: String,
                required: false,
                default: ''
            }
        },

        data() {
            return {
                internalValue: this.value || ''
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

        watch: {
            value: function(value) {
                this.internalValue = value;
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
                    this.internalValue = e.target.value;

                    return this.$emit('input', e.target.value);
                }

                const regex = new RegExp(this.internalRegex, 'g');
                const matches = e.target.value.match(regex);

                this.internalValue = matches ? matches.join('') : '';
                this.$el.value = this.internalValue;
                this.$emit('input', this.internalValue);
            }
        }
    };
</script>
