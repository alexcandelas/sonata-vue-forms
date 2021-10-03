<template>
    <input
        :id="computedId"
        :name="computedName"
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
                displayValueFormat: {},
                formSupportsDates: this.supportsDates
            };
        },

        computed: {
            /**
             * Set the field placeholder.
             */
            computedPlaceholder: function() {
                return this.$attrs.placeholder || this.displayValueFormat.format;
            }
        },

        watch: {
            value: function(value) {
                this.setInitialValue(value);
            },

            displayValue: function(value) {
                this.$emit('input', this.formatDate(value));
            }
        },

        /**
         * Check for browser support of native `date` fields
         * and set the initial value if given.
         */
        created() {
            this.setBrowserSupport();

            if (! this.formSupportsDates) {
                this.setDisplayValueFormat();
            }

            this.setInitialValue(this.value);
        },

        methods: {
            /**
             * Normalize date for browsers that don't support
             * native `date` fields.
             *
             * @param  {string} date
             * @param  {boolean} forDisplay - Get format for displaying in text field.
             * @return {string}
             */
            formatDate(date, forDisplay = false) {
                if (this.formSupportsDates || ! date) {
                    return date;
                }

                const entryRegex = forDisplay ?
                    /^(\d{4})-(\d{2})-(\d{2})$/ :
                    this.displayValueFormat.regex;

                const matches = entryRegex.exec(date);

                if (! matches) {
                    return date;
                }

                if (forDisplay) {
                    let newValue = [];
                    newValue[this.displayValueFormat.order.y - 1] = matches[1];
                    newValue[this.displayValueFormat.order.m - 1] = matches[2];
                    newValue[this.displayValueFormat.order.d - 1] = matches[3];

                    return newValue.join(this.displayValueFormat.separator);
                }

                return matches[this.displayValueFormat.order.y] + '-' +
                    matches[this.displayValueFormat.order.m].padStart(2, 0) + '-' +
                    matches[this.displayValueFormat.order.d].padStart(2, 0);
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
             * Set the initial value for the component.
             */
            setInitialValue(value) {
                if (! value) {
                    return;
                }

                this.displayValue = this.formSupportsDates ?
                    value :
                    this.formatDate(value, true);
            },

            /**
             * Set display value format and regex for browsers
             * that don't support native `date` fields.
             */
            setDisplayValueFormat() {
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

                this.displayValueFormat = {
                    format: format.join(separator),
                    order,
                    separator,
                    regex: new RegExp('^' + regex.join('\\' + separator) + '$')
                };
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
            },

            /**
             * Validate that the given format is a well formed string.
             *
             * @return {array}
             */
            validateFormat() {
                const validDate = /^(d+|m+|y+(?=[\/.-]))([\/.-])(d+|m+|y+(?=[\/.-]))([\/.-])(d+|m+|y+(?=$))+$/i;
                const matches = validDate.exec(this.format.toLowerCase());

                if (! matches) {
                    throw new Error(`The "format" property provided to ${this.$options.componentName} component is invalid.`);
                }

                const hasRequiredValues = [matches[1][0], matches[3][0], matches[5][0]].sort().join('') === 'dmy';

                if (! hasRequiredValues) {
                    throw new Error(`The "format" property provided to ${this.$options.componentName} component is invalid.`);

                    return null;
                }

                return matches;
            }
        }
    };
</script>
