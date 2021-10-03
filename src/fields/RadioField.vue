<template>
    <label>
        <input
            :name="computedName"
            class="radio"
            :class="[inputClass, {
                'radio--invalid': hasErrors
            }]"
            type="radio"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy"
            :checked="isChecked"
            :value="value"
            v-bind="$attrs"
            ref="radio"
            @change="$emit('change', value)"
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

        componentName: 'RadioField',

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
             * Check if the radio field should be selected.
             */
            isChecked: function() {
                return this.formValue === this.value;
            }
        }
    };
</script>
