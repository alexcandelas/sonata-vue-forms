<template>
    <input
        :id="computedId"
        :name="name"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        type="date"
        maxlength="10"
        :placeholder="computedPlaceholder"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        v-model="displayValue"
    >
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        componentName: 'DateField',

        props: {
            /**
             * The expected display format for unsupported browsers.
             */
            format: {
                type: String,
                required: false,
                default: 'd/m/y'
            },

            /**
             * Define if browser supports native `date` type fields.
             */
            supportsDates: {
                type: Boolean,
                required: false,
                default: null
            }
        },

        data() {
            return {
                displayValue: '',
                displayFormat: {},
                formSupportsDates: this.supportsDates
            };
        },

        computed: {
            /**
             * Set a placeholder for unsupported browsers.
             */
            computedPlaceholder: function() {
                return this.$attrs.placeholder || this.displayFormat.format;
            }
        },

        watch: {
            modelValue: function(value) {
                this.updateDisplayValue(value);
            },

            displayValue: function(value) {
                this.$emit('update:modelValue', this.formatValue(value));
            }
        },

        /**
         * Check for browser support of native `date` fields
         * and set the initial value.
         */
        created() {
            this.setBrowserSupport();

            if (! this.formSupportsDates) {
                this.setDisplayFormat();
            }

            this.updateDisplayValue(this.modelValue);
        },

        methods: {
            /**
             * Return a normalized date for browsers
             * that don't support native `date` fields.
             *
             * @param  {string} date
             * @param  {boolean} forDisplay - For displaying in text field.
             * @return {string}
             */
            formatValue(date, forDisplay = false) {
                if (this.formSupportsDates || ! date) {
                    return date;
                }

                const entryRegex = forDisplay ?
                    /^(\d{4})-(\d{2})-(\d{2})$/ :
                    this.displayFormat.regex;

                const matches = entryRegex.exec(date);

                if (! matches) {
                    return date;
                }

                if (forDisplay) {
                    let newValue = [];
                    newValue[this.displayFormat.order.y - 1] = matches[1];
                    newValue[this.displayFormat.order.m - 1] = matches[2];
                    newValue[this.displayFormat.order.d - 1] = matches[3];

                    return newValue.join(this.displayFormat.separator);
                }

                return matches[this.displayFormat.order.y] + '-' +
                    matches[this.displayFormat.order.m].padStart(2, 0) + '-' +
                    matches[this.displayFormat.order.d].padStart(2, 0);
            },

            /**
             * Update the display value.
             */
            updateDisplayValue(value) {
                if (! value) {
                    return;
                }

                this.displayValue = this.formatValue(value, true);
            },

            /**
             * Set display value format and regex for browsers
             * that don't support native `date` fields.
             */
            setDisplayFormat() {
                const matches = this.validateFormat();

                if (! matches) {
                    return;
                }

                const separator = matches[2];
                const order = {};
                let format = [];
                let regex = [];

                [matches[1][0], matches[3][0], matches[5][0]].forEach((letter, i) => {
                    order[letter] = i + 1;
                    format.push(letter === 'y' ? letter.repeat(4) : letter.repeat(2));
                    regex.push(letter === 'y' ? '(\\d{4})' : '(\\d{1,2})');
                });

                this.displayFormat = {
                    format: format.join(separator),
                    order,
                    separator,
                    regex: new RegExp('^' + regex.join('\\' + separator) + '$')
                };
            },

            /**
             * Validate that the "format" prop is a well formed string.
             *
             * @return {array}
             */
            validateFormat() {
                const errorMessage = `The "format" property provided to ${this.$options.componentName} component is invalid.`;
                const validDate = /^(d+|m+|y+(?=[/.-]))([/.-])(d+|m+|y+(?=[/.-]))([/.-])(d+|m+|y+(?=$))+$/i;
                const matches = validDate.exec(this.format.toLowerCase());

                if (! matches) {
                    throw new Error(errorMessage);
                }

                const hasRequiredValues = [matches[1][0], matches[3][0], matches[5][0]].sort().join('') === 'dmy';

                if (! hasRequiredValues) {
                    throw new Error(errorMessage);
                }

                return matches;
            },

            /**
             * Set browser support of `date` type fields if not set already.
             */
            setBrowserSupport() {
                if (
                    typeof this.formSupportsDates !== 'boolean' &&
                    typeof this.$parent.supportsDates !== 'boolean'
                ) {
                    this.formSupportsDates = this.testBrowserSupport();
                    this.$parent.supportsDates = this.formSupportsDates;
                    this.$emit('date-support-check', this.formSupportsDates);
                }
            },

            /**
             * Determine if browser supports native `date` type fields.
             *
             * @return boolean
             */
            testBrowserSupport() {
                const input = document.createElement('input');

                input.setAttribute('type', 'date');
                input.setAttribute('value', 'invalid-date');

                return input.value !== 'invalid-date';
            }
        }
    };
</script>
