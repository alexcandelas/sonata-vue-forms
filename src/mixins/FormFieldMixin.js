import kebabCase from 'lodash/kebabCase';

export default {
    props: {
        /**
         * Define if the component will show validation errors.
         */
        displayErrors: {
            type: Boolean,
            required: false,
            default: true
        },

        /**
         * List of current validation errors for this field.
         */
        errors: {
            type: Array,
            required: false,
            default: null
        },

        /**
         * Optionally define the `id` attribute for the field.
         */
        id: {
            type: String,
            required: false
        },

        /**
         * Define the `name` attribute for the field.
         */
        name: {
            type: String,
            required: true
        },

        /**
         * Declaring modelValue as a property is necessary
         * for binding data inside custom form components.
         */
        modelValue: {
            required: false
        },

        /**
         * Optionally define a different name to look for
         * validation errors in the `errors` list.
         */
        validationName: {
            type: String,
            required: false
        }
    },

    computed: {
        /**
         * Return a formatted ID for the field.
         */
        computedId() {
            return this.id || kebabCase(this.name);
        },

        /**
         * Add the ID of the validation error to the `aria-describedby`
         * attribute if validation fails.
         */
        describedBy() {
            const originalDescribedBy = this.$attrs['aria-describedby'] || '';

            if (! this.displayErrors) {
                return originalDescribedBy;
            }

            return this.hasErrors ?
                `${this.computedId}-errors ${originalDescribedBy}` :
                originalDescribedBy;
        },

        /**
         * Check if the field has any errors.
         */
        hasErrors() {
            if (this.errors !== null) {
                return !! this.errors.length;
            }

            // Remove the "[]" ending from multiplevalue fields, like "images[]".
            const fieldName = this.validationName || this.name.replace(/\[\]$/, '');

            return !! (
                this.$parent.errors[fieldName] &&
                this.$parent.errors[fieldName].length
            );
        }
    }
};
