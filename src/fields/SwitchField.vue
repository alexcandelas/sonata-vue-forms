<template>
    <span class="form-switch">
        <input
            :id="computedId"
            :name="name"
            class="form-switch__input"
            :class="[inputClass, {
                'form-switch__input--invalid': hasErrors
            }]"
            type="checkbox"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            v-bind="$attrs"
            :value="value"
            :checked="isChecked"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 12.5L10 17 20 7"/></svg>
                </slot>
            </span>

            <span
                class="form-switch__toggle-btn"
                :class="btnAnimation"
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

        componentName: 'SwitchField',

        props: {
            /**
             * Define if the labels inside the component (icons by default)
             * are visible.
             */
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
            },

            /**
             * Native value for the input.
             */
            value: {
                type: String,
                required: false
            }
        },

        data() {
            return {
                btnAnimation: ''
            };
        },

        computed: {
            isChecked: function() {
                return !! this.modelValue;
            }
        },

        methods: {
            /**
             * Emit the new value and trigger button animation.
             *
             * @param {Object} e
             */
            onChange(e) {
                this.$emit('update:modelValue', e.target.checked);

                this.$nextTick(() => {
                    this.btnAnimation = '';

                    this.$nextTick(() => {
                        this.btnAnimation = this.isChecked ?
                            'form-switch__toggle--on' :
                            'form-switch__toggle--off';
                    });
                });
            }
        }
    };
</script>
