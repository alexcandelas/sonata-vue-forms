<template>
    <label>
        <input
            :name="name"
            class="radio"
            :class="[inputClass, {
                'radio--invalid': hasErrors
            }]"
            type="radio"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            v-bind="$attrs"
            :value="value"
            :checked="modelValue === value"
            @change="$emit('update:modelValue', $event.target.value)"
        >
        <slot></slot>
    </label>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        inheritsAttrs: false,

        componentName: 'RadioField',

        props: {
            /**
             * CSS class for input element.
             */
            inputClass: {
                type: String,
                required: false
            },

            /**
             * Native value for the input.
             */
            value: {
                type: String,
                required: true
            }
        }
    };
</script>
