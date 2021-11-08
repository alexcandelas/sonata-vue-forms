<template>
    <span class="form-switch">
        <input
            :id="computedId"
            :name="computedName"
            class="form-switch__input"
            :class="[inputClass, {
                'form-switch__input--invalid': hasErrors
            }]"
            type="checkbox"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            :checked="isChecked"
            :value="value"
            v-bind="$attrs"
            @change="onChange"
        >

        <span
            class="form-switch__toggle"
            :class="{'form-switch__toggle--checked': isChecked}"
        >
            <span class="form-switch__label form-switch__label--on">
                <slot
                    v-if="showLabels"
                    name="on-label"
                >
                    <svg slot="on-label" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5L10 17 20 7"/></svg>
                </slot>
            </span>

            <span
                class="form-switch__toggle-btn"
                :class="animation"
            ></span>

            <span class="form-switch__label form-switch__label--off">
                <slot
                    v-if="showLabels"
                    name="off-label"
                ></slot>
            </span>
        </span>
    </span>
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

        componentName: 'SwitchField',

        props: {
            /**
             * Declaring `formValue` as a property is necessary
             * for binding data inside the custom component.
             */
            formValue: {
                required: false
            },

            showLabels: {
                type: Boolean,
                required: false,
                default: true
            },

            /**
             * CSS class for input element.
             */
            inputClass: {
                type: String,
                required: false
            }
        },

        data() {
            return {
                animation: ''
            };
        },

        computed: {
            isChecked: function() {
                return this.value ? this.value : !! this.formValue;
            }
        },

        methods: {
            /**
             * Emit the new value.
             *
             * @param {Object} e
             */
            onChange(e) {
                this.animation = '';

                this.$emit('change', e.target.checked);

                Vue.nextTick(() => {
                    this.animation = this.isChecked ?
                        'form-switch__toggle--on' :
                        'form-switch__toggle--off';
                });
            }
        }
    };
</script>
