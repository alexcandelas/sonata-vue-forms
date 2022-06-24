<template>
    <label>
        <input
            :name="name"
            class="checkbox"
            :class="[inputClass, {
                'checkbox--invalid': hasErrors
            }]"
            type="checkbox"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            v-bind="$attrs"
            :value="value"
            :checked="isChecked"
            @change="onChange"
        >
        <slot></slot>
    </label>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        inheritsAttrs: false,

        componentName: 'CheckboxField',

        props: {
            /**
             * CSS class for input element.
             */
            inputClass: {
                type: String,
                required: false
            },

            /**
             * Native value for the input when binding multiple checkbox
             * to a single form field.
             */
            value: {
                type: String,
                required: false
            }
        },

        computed: {
            /**
             * Check if the value for this checkbox is present
             * in the form's fields object.
             */
            isChecked: function() {
                if (this.value) {
                    return Array.isArray(this.modelValue) && this.modelValue.includes(this.value);
                }

                return !! this.modelValue;
            }
        },

        /**
         * For forms that accept multiple checkbox binded to the same field,
         * it’s necessary to setup an array as initial value.
         */
        created() {
            if (this.value && ! Array.isArray(this.modelValue)) {
                this.$emit('update:modelValue', []);
            }
        },

        methods: {
            /**
             * Emit the new value.
             */
            onChange() {
                let newValue;

                if (this.value) {
                    // Copy modelValue prop to a new array
                    newValue = [...this.modelValue];

                    if (this.isChecked) {
                        newValue.splice(newValue.indexOf(this.value), 1);
                    }
                    else {
                        newValue.push(this.value);
                    }
                }
                else {
                    newValue = ! this.isChecked;
                }

                this.$emit('update:modelValue', newValue);
            }
        }
    };
</script>
