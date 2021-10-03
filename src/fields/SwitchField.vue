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
            <span class="form-switch__text form-switch__text--on">
                <slot name="on">
                    <template v-if="showText">{{ translate('on') }}</template>
                </slot>
            </span>

            <span
                class="form-switch__toggle-btn"
                :class="animation"
            ></span>

            <span class="form-switch__text form-switch__text--off">
                <slot name="off">
                    <template v-if="showText">{{ translate('off') }}</template>
                </slot>
            </span>
        </span>
    </span>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';
    import Localization from '../mixins/LocalizationMixin.js';

    export default {
        mixins: [FormField, Localization],

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

            /**
             * CSS class for input element.
             */
            inputClass: {
                type: String,
                required: false
            },

            /**
             * If component should diplay the default text for the `on`
             * and `off` statuses.
             */
            showText: {
                type: Boolean,
                required: false,
                default: true
            }
        },

        data() {
            return {
                animation: '',
                localization: {
                    en: {
                        off: 'Off',
                        on: 'On'
                    },
                    es: {
                        off: 'No',
                        on: 'Sí'
                    }
                }
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
