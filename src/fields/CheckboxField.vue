<template>
    <label>
        <input
            :name="computedName"
            class="checkbox"
            :class="[inputClass, {
                'checkbox--invalid': hasErrors
            }]"
            type="checkbox"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            :checked="isChecked"
            :value="value"
            v-bind="$attrs"
            ref="checkbox"
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

        model: {
            event: 'change',
            prop: 'formValue'
        },

        componentName: 'CheckboxField',

        props: {
            /**
             * Declaring `formValue` as a property is necessary
             * for binding data inside the custom component.
             */
            formValue: {
                required: false
            },

            /**
             * CSS class for input element.
             */
            inputClass: {
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
                return this.value ?
                    Array.isArray(this.formValue) && this.formValue.includes(this.value) :
                    !! this.formValue;
            }
        },

        /**
         * Prepare the field that stores the data of this component in parent
         * form as an array when accepting multiple values in checkbox.
         */
        created() {
            if (this.value && ! Array.isArray(this.formValue)) {
                this.$emit('change', []);
            }
        },

        methods: {
            /**
             * Emit the new value.
             */
            onChange() {
                let newValue;

                if (this.value) {
                    newValue = [...this.formValue];

                    if (this.isChecked) {
                        newValue.splice(newValue.indexOf(this.value), 1);
                    }
                    else {
                        newValue.push(this.value);
                    }
                }
                else {
                    newValue = ! this.isChecked
                }

                this.$emit('change', newValue);
            }
        }
    };
</script>
