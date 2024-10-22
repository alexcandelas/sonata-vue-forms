<template>
    <input
        :id="computedId"
        :name="name"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        type="date"
        maxlength="10"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedby="describedBy || null"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        componentName: 'DateField',
    };
</script>
