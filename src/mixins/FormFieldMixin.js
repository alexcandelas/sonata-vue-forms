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
         * Optionally define the `name` attribute for the field.
         */
        name: {
            type: String,
            required: false
        },

        /**
         * Declaring the value as a property is necessary for binding
         * the data inside custom input components.
         */
        value: {
            required: false
        }
    },

    computed: {
        /**
         * Return a formatted ID for the field.
         */
        computedId() {
            return this.id || kebabCase(this.computedName);
        },

        /**
         * Set the `name` attribute for the field.
         */
        computedName() {
            const name = this.name || this.$vnode.data.model.expression;

            if (! name) {
                throw new Error(`The ${this.$options.componentName} Vue component requires a "name" property.`);
            }

            return name.replace(/^fields\./, '');
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
            const fieldName = this.computedName.replace(/\[\]$/, '');

            return !! (
                this.$parent.errors[fieldName] &&
                this.$parent.errors[fieldName].length
            );
        }
    }
};
