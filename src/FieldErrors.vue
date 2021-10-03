<template>
    <ul
        v-if="fieldErrors && fieldErrors.length"
        :id="computedId"
        class="error"
    >
        <li
            v-for="(error, i) in fieldErrors"
            :key="i"
            v-text="error"
        ></li>
    </ul>
</template>

<script>
    import kebabCase from 'lodash/kebabCase';

    export default {
        props: {
            /**
             * List of validation errors for the associated field.
             */
            errors: {
                type: Array,
                required: false,
                default: null
            },

            /**
             * The `name` value of the associated field.
             */
            name: {
                type: String,
                required: true
            }
        },

        computed: {
            /**
             * Fetch the validation errors for the associated field
             * from the parent form component.
             *
             * @return {array}
             */
            fieldErrors() {
                return this.errors !== null ?
                    this.errors :
                    this.$parent.errors[this.name];
            },

            /**
             * Return a formatted ID for the error list.
             *
             * @return {string}
             */
            computedId() {
                return kebabCase(this.name + '-errors');
            }
        }
    };
</script>
